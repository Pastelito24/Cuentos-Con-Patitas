from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, send_from_directory, make_response
from flask_mysqldb import MySQL
from flask_cors import CORS
from app import create_app
from app.configuracion import configu
from datetime import datetime
import re
import traceback
from werkzeug.security import check_password_hash
from flask_login import LoginManager, login_user, current_user
from app.entidades.fundacion_user import FundacionUser
from werkzeug.utils import secure_filename
import os

app = create_app()
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])
app.config.from_object(configu['desarrolloConfig'])
app.secret_key = 'cerrado123456'

db = MySQL(app)

# modelos
from app.modelo_usuario import Modelo_usuario
from app.modelo_fundacion import Modelo_fundacion

# entidades
from app.entidades.usuario import Usuario

# flask-login setup
login_manager = LoginManager()
login_manager.init_app(app)

# Configuración de carpetas estáticas
UPLOAD_FOLDER_FUNDACIONES = os.path.join(os.path.dirname(__file__), 'static', 'fundaciones')
UPLOAD_FOLDER_ANIMALES = os.path.join(os.path.dirname(__file__), 'static', 'animales')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

app.config['UPLOAD_FOLDER_FUNDACIONES'] = UPLOAD_FOLDER_FUNDACIONES
app.config['UPLOAD_FOLDER_ANIMALES'] = UPLOAD_FOLDER_ANIMALES

# Asegurarse de que las carpetas existan
os.makedirs(UPLOAD_FOLDER_FUNDACIONES, exist_ok=True)
os.makedirs(UPLOAD_FOLDER_ANIMALES, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@login_manager.user_loader
def load_user(user_id):
    # Buscar usuario normal
    cursor = db.connection.cursor()
    cursor.execute("SELECT cedula, contrasena, rol, nombre, telefono, email, direccion, edad, fundacion_id FROM usuarios WHERE cedula = %s", (user_id,))
    row = cursor.fetchone()
    if row:
        user = Usuario(*row)
        return user
    # Buscar fundación por NIT
    cursor.execute("SELECT nit, nombre, email FROM Fundaciones WHERE nit = %s", (user_id,))
    fundacion = cursor.fetchone()
    if fundacion:
        return FundacionUser(fundacion[0], fundacion[1], fundacion[2])
    return None

@app.route('/')
def home():
    return redirect(url_for('login'))

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        rol = data.get('rol', 'usuario').lower()
        if rol == 'fundacion':
            cursor = db.connection.cursor()
            cursor.execute("SELECT nit, nombre, email, contrasena FROM Fundaciones WHERE nit = %s", (data['nit'],))
            fundacion = cursor.fetchone()
            if fundacion and check_password_hash(fundacion[3], data['password']):
                user = FundacionUser(fundacion[0], fundacion[1], fundacion[2])
                login_user(user)
                return jsonify({
                    'status': 'success',
                    'message': 'Login exitoso',
                    'fundacion': {
                        'nit': fundacion[0],
                        'nombre': fundacion[1],
                        'email': fundacion[2]
                    }
                }), 200
            else:
                return jsonify({'status': 'error', 'message': 'Usuario o contraseña incorrectos'}), 401
        else:
            user = Usuario(data['email'], data['password'])
            usuario_logeado = Modelo_usuario.comprobar_user(db, user)
            if usuario_logeado is not None:
                login_user(usuario_logeado)
                return jsonify({
                    'status': 'success',
                    'message': 'Login exitoso',
                    'user': {
                        'cedula': usuario_logeado.cedula,
                        'nombre': usuario_logeado.nombre,
                        'email': usuario_logeado.email,
                        'rol': usuario_logeado.rol,
                        'telefono': usuario_logeado.telefono,
                        'direccion': usuario_logeado.direccion,
                        'edad': usuario_logeado.edad,
                        'fundacion_id': usuario_logeado.fundacion_id
                    }
                }), 200
            else:
                return jsonify({'status': 'error', 'message': 'Usuario o contraseña incorrectos'}), 401
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/dashboard')
def dashboard():
    return jsonify({
        'status': 'success',
        'message': 'Bienvenido al dashboard'
    })

@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        rol = data.get('rol', 'Usuario').lower()
        fundacion_id = None

        
        # registro de datos de la fundación
        if rol == 'fundacion':
            # 1. NIT único
            cursor = db.connection.cursor()
            cursor.execute("SELECT 1 FROM Fundaciones WHERE nit = %s", (data['nit'],))
            if cursor.fetchone():
                return jsonify({'status': 'error', 'message': 'El NIT ya está registrado'}), 400

            # 2. Teléfono de 10 números
            telefono = data['telefono']
            if not (telefono.isdigit() and len(telefono) == 10):
                return jsonify({'status': 'error', 'message': 'El teléfono debe tener exactamente 10 números'}), 400

            # 3. Email único y formato
            email = data['email']
            cursor.execute("SELECT 1 FROM Fundaciones WHERE email = %s", (email,))
            if cursor.fetchone():
                return jsonify({'status': 'error', 'message': 'El email ya está registrado'}), 400

            # Expresión regular: solo formato de email básico
            if not re.match(r'^[^@\s]+@[^@\s]+\.[^@\s]+$', email):
                return jsonify({'status': 'error', 'message': 'El email debe tener @ y un dominio válido'}), 400

            # 4. Contraseña de mínimo 8 caracteres
            contrasena = data['contrasena']
            if len(contrasena) < 8:
                return jsonify({'status': 'error', 'message': 'La contraseña debe tener al menos 8 caracteres'}), 400
            
            fundacion_data = {
                'nit': data['nit'],
                'nombre': data['nombre'],
                'direccion': data['direccion'],
                'telefono': data['telefono'],
                'email': data['email'],
                'persona_acargo': data['persona_acargo'],
                'contrasena': data['contrasena'],
                'descripcion': data.get('descripcion', '')
            }
            fundacion_creada = Modelo_fundacion.crear_fundacion(db, fundacion_data)
            if fundacion_creada:
                return jsonify({'status': 'success', 'message': 'Fundación registrada correctamente'}), 201
            else:
                return jsonify({'status': 'error', 'message': 'No se pudo registrar la fundación'}), 400

        elif rol == 'usuario':
            birthdate = datetime.strptime(data['birthdate'], '%Y-%m-%d')
            today = datetime.today()
            edad = today.year - birthdate.year - ((today.month, today.day) < (birthdate.month, birthdate.day))
            user = Usuario(
                data['documentNumber'],
                data['password'],
                data.get('rol', 'Usuario'),
                data['username'],
                data['phone'],
                data['email'],
                data['address'],
                edad,
                fundacion_id
            )
            creado = Modelo_usuario.crear_usuario(db, user)
            if creado:
                return jsonify({'status': 'success', 'message': 'Usuario registrado correctamente', 'user': data}), 201
            else:
                return jsonify({'status': 'error', 'message': 'No se pudo registrar el usuario'}), 400

        else:
            return jsonify({'status': 'error', 'message': 'Rol no reconocido'}), 400

    except Exception as e:
        print('ERROR EN REGISTRO FUNDACION:', e)
        traceback.print_exc()
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/fundaciones', methods=['GET'])
def listar_fundaciones():
    cursor = db.connection.cursor()
    cursor.execute("SELECT fundacion_id, nombre, direccion, telefono, email, persona_acargo, foto_url, descripcion FROM Fundaciones")
    fundaciones = cursor.fetchall()
    keys = [desc[0] for desc in cursor.description]
    return jsonify([dict(zip(keys, row)) for row in fundaciones])

def convert_to_dict(row, columns):
    """
    Convierte una fila de resultados de la base de datos (tupla) en un diccionario,
    manejando correctamente los tipos de datos, especialmente los booleanos.
    """
    result = {}
    for i, column in enumerate(columns):
        value = row[i]
        
        if column == 'disponibilidad':
            result[column] = bool(value)
        elif isinstance(value, bytes):
            result[column] = value.decode('utf-8')
        else:
            result[column] = value
            
    return result


@app.route('/api/animales_de_fundacion', methods=['GET'])
def animales_de_fundacion():
    if not hasattr(current_user, 'nit'):
        return jsonify({'error': 'No autorizado'}), 403
        
    try:
        cursor = db.connection.cursor()
        
        cursor.execute("""
            SELECT 
                animal_id, fundacion_id, nombre, tipo_animal, genero, raza, edad, peso,
                condicion, descripcion, CAST(disponibilidad AS UNSIGNED) AS disponibilidad,
                fecha_ingreso, fotoanimal_url
            FROM animales
            WHERE fundacion_id = (SELECT fundacion_id FROM Fundaciones WHERE nit = %s)
            ORDER BY fecha_ingreso DESC
        """, (current_user.nit,))
        
        animales = cursor.fetchall()
        
        if animales:
            columns = [desc[0] for desc in cursor.description]
            result = [convert_to_dict(animal, columns) for animal in animales]
            response = make_response(jsonify(result))
        else:
            response = make_response(jsonify([]))

        response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '0'
        return response
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/editar_foto_fundacion', methods=['POST'])
def editar_foto_fundacion():
    print('===> Entrando a /api/editar_foto_fundacion')
    print('current_user:', getattr(current_user, 'nit', None))
    print('request.files:', request.files)
    if not hasattr(current_user, 'nit'):
        print('No autorizado')
        return jsonify({'success': False, 'error': 'No autorizado'}), 403
    if 'foto' not in request.files:
        print('Archivo no enviado')
        return jsonify({'success': False, 'error': 'Archivo no enviado'}), 400
    file = request.files['foto']
    print('file.filename:', file.filename)
    if file.filename == '':
        print('Nombre de archivo vacío')
        return jsonify({'success': False, 'error': 'Nombre de archivo vacío'}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(f"{current_user.nit}_fundacion.{file.filename.rsplit('.', 1)[1].lower()}")
        filepath = os.path.join(app.config['UPLOAD_FOLDER_FUNDACIONES'], filename)
        print('Guardando archivo en:', filepath)
        file.save(filepath)
        foto_url = f"/static/fundaciones/{filename}"
        cursor = db.connection.cursor()
        cursor.execute("UPDATE Fundaciones SET foto_url = %s WHERE nit = %s", (foto_url, current_user.nit))
        db.connection.commit()
        print('Foto guardada y base de datos actualizada:', foto_url)
        return jsonify({'success': True, 'foto_url': foto_url})
    else:
        print('Tipo de archivo no permitido')
        return jsonify({'success': False, 'error': 'Tipo de archivo no permitido'}), 400

@app.route('/api/mi_fundacion')
def mi_fundacion():
    if not hasattr(current_user, 'nit'):
        return jsonify({}), 200
    
    try:
        cursor = db.connection.cursor()
        cursor.execute("""
            SELECT nit, nombre, direccion, telefono, email, 
                   persona_acargo, foto_url, descripcion 
            FROM Fundaciones 
            WHERE nit = %s
        """, (current_user.nit,))
        fundacion = cursor.fetchone()
        if fundacion:
            keys = ['nit', 'nombre', 'direccion', 'telefono', 'email', 
                   'persona_acargo', 'foto_url', 'descripcion']
            fundacion_dict = dict(zip(keys, fundacion))
            return jsonify(fundacion_dict)
        return jsonify({}), 200
    except Exception as e:
        print('Error al obtener fundación:', e)
        return jsonify({'error': str(e)}), 500

@app.route('/api/editar_descripcion_fundacion', methods=['POST'])
def editar_descripcion_fundacion():
    if not hasattr(current_user, 'nit'):
        return jsonify({'success': False, 'error': 'No autorizado'}), 403
    
    data = request.get_json()
    if 'descripcion' not in data:
        return jsonify({'success': False, 'error': 'Falta la descripción'}), 400
    
    try:
        cursor = db.connection.cursor()
        cursor.execute(
            "UPDATE Fundaciones SET descripcion = %s WHERE nit = %s",
            (data['descripcion'], current_user.nit)
        )
        db.connection.commit()
        return jsonify({'success': True, 'message': 'Descripción actualizada correctamente'})
    except Exception as e:
        return jsonify({'success': False, 'error': 'Error al actualizar la descripción'}), 500

@app.route('/api/agregar_animal', methods=['POST'])
def agregar_animal():
    if not hasattr(current_user, 'nit'):
        return jsonify({'success': False, 'error': 'No autorizado'}), 403
    
    try:
        data = request.get_json()
        cursor = db.connection.cursor()

        cursor.execute("SELECT fundacion_id FROM Fundaciones WHERE nit = %s", (current_user.nit,))
        fundacion = cursor.fetchone()
        if not fundacion:
            return jsonify({'success': False, 'error': 'Fundación no encontrada'}), 404
        fundacion_id = fundacion[0]

        # Validar campos
        required_fields = ['nombre', 'tipo_animal', 'genero', 'edad', 'peso']
        if not all(field in data and str(data[field]).strip() for field in required_fields):
            return jsonify({'success': False, 'error': 'Faltan campos requeridos'}), 400
        
        sql = """
            INSERT INTO animales (
                fundacion_id, nombre, tipo_animal, edad, peso, 
                condicion, descripcion, fotoanimal_url, fecha_ingreso, 
                disponibilidad, genero, raza
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, CURRENT_DATE, %s, %s, %s)
        """
        cursor.execute(sql, (
            fundacion_id,
            data['nombre'],
            data['tipo_animal'].lower(),
            int(data['edad']),
            float(data['peso']),
            data.get('condicion', ''),
            data.get('descripcion', ''),
            data.get('fotoanimal_url'), 
            data.get('disponibilidad', True),
            data['genero'].lower(),
            data.get('raza', '')
        ))
        db.connection.commit()
        animal_id = cursor.lastrowid

        # Devolver el animal recién creado
        cursor.execute("""
            SELECT 
                animal_id, fundacion_id, nombre, tipo_animal, genero, raza, edad, peso,
                condicion, descripcion, CAST(disponibilidad AS UNSIGNED) AS disponibilidad,
                fecha_ingreso, fotoanimal_url
            FROM animales WHERE animal_id = %s
        """, (animal_id,))
        
        nuevo_animal = cursor.fetchone()
        if nuevo_animal:
            columns = [desc[0] for desc in cursor.description]
            animal_dict = convert_to_dict(nuevo_animal, columns)
            return jsonify({'success': True, 'animal': animal_dict, 'message': 'Animalito agregado con éxito'})
        else:
            return jsonify({'success': False, 'error': 'No se pudo recuperar el animal agregado'}), 500

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/editar_animal/<int:animal_id>', methods=['PUT'])
def editar_animal(animal_id):
    if not hasattr(current_user, 'nit'):
        return jsonify({'success': False, 'error': 'No autorizado'}), 403
    
    try:
        data = request.get_json()
        
        disponibilidad_para_db = 1 if data.get('disponibilidad') else 0

        cursor = db.connection.cursor()

        # Primero obtenemos la fundacion_id del usuario actual
        cursor.execute("SELECT fundacion_id FROM Fundaciones WHERE nit = %s", (current_user.nit,))
        fundacion = cursor.fetchone()
        if not fundacion:
            return jsonify({'success': False, 'error': 'Fundación no encontrada'}), 404
        
        user_fundacion_id = fundacion[0]
        
        # Verificar si el animal existe y pertenece a la fundación actual
        cursor.execute("""
            SELECT * 
            FROM animales 
            WHERE animal_id = %s
        """, (animal_id,))
        
        animal = cursor.fetchone()
        if not animal:
            return jsonify({'success': False, 'error': 'Animal no encontrado'}), 404
            
        # Obtener el fundacion_id del animal (índice 1 según la estructura proporcionada)
        animal_fundacion_id = animal[1]
        if isinstance(animal_fundacion_id, bytes):
            animal_fundacion_id = animal_fundacion_id.decode('utf-8')
            
        if str(animal_fundacion_id) != str(user_fundacion_id):
            return jsonify({'success': False, 'error': 'No autorizado para editar este animal'}), 403

        # Validar datos requeridos
        required_fields = ['nombre', 'tipo_animal', 'genero', 'edad', 'peso']
        for field in required_fields:
            if field not in data or not str(data[field]).strip():
                return jsonify({'success': False, 'error': f'El campo {field} es requerido'}), 400

        # Actualizar los datos del animal
        cursor.execute("""
            UPDATE animales 
            SET nombre = %s, 
                tipo_animal = %s, 
                genero = %s, 
                raza = %s,
                edad = %s, 
                peso = %s, 
                condicion = %s, 
                descripcion = %s,
                disponibilidad = %s
            WHERE animal_id = %s
            """, (
                data['nombre'],
                data['tipo_animal'].lower(),
                data['genero'].lower(),
                data.get('raza', ''),
                int(data['edad']),
                float(data['peso']),
                data.get('condicion', ''),
                data.get('descripcion', ''),
                disponibilidad_para_db,
                animal_id
            ))
            
        db.connection.commit()
        
        # Obtener los datos actualizados del animal
        cursor.execute("""
            SELECT 
                animal_id, fundacion_id, nombre, tipo_animal, genero, raza, edad, peso,
                condicion, descripcion, CAST(disponibilidad AS UNSIGNED) AS disponibilidad,
                fecha_ingreso, fotoanimal_url
            FROM animales 
            WHERE animal_id = %s
        """, (animal_id,))
        
        updated_animal = cursor.fetchone()

        if updated_animal:
            columns = [desc[0] for desc in cursor.description]
            animal_dict = convert_to_dict(updated_animal, columns)
            return jsonify({
                'success': True,
                'message': 'Animal actualizado correctamente',
                'animal': animal_dict
            })
        else:
            return jsonify({'success': False, 'error': 'Error al obtener los datos actualizados'}), 404
        
    except ValueError as e:
        return jsonify({'success': False, 'error': 'Error en el formato de los datos: ' + str(e)}), 400
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/eliminar_animal/<int:animal_id>', methods=['DELETE'])
def eliminar_animal(animal_id):
    if not hasattr(current_user, 'nit'):
        return jsonify({'success': False, 'error': 'No autorizado'}), 403
    
    try:
        cursor = db.connection.cursor()
        
        # Primero obtenemos la fundacion_id del usuario actual
        cursor.execute("SELECT fundacion_id FROM Fundaciones WHERE nit = %s", (current_user.nit,))
        fundacion = cursor.fetchone()
        
        if not fundacion:
            return jsonify({'success': False, 'error': 'Fundación no encontrada'}), 404
            
        user_fundacion_id = fundacion[0]
        
        # Verificar si el animal existe y pertenece a la fundación actual
        cursor.execute("""
            SELECT * 
            FROM animales 
            WHERE animal_id = %s
        """, (animal_id,))
        
        animal = cursor.fetchone()
        if not animal:
            return jsonify({'success': False, 'error': 'Animal no encontrado'}), 404
            
        # Obtener el fundacion_id del animal (índice 1 según la estructura proporcionada)
        animal_fundacion_id = animal[1]
        if isinstance(animal_fundacion_id, bytes):
            animal_fundacion_id = animal_fundacion_id.decode('utf-8')
            
        if str(animal_fundacion_id) != str(user_fundacion_id):
            return jsonify({'success': False, 'error': 'No autorizado para eliminar este animal'}), 403

        # Eliminar la foto si existe
        foto_url = animal[10]  # Índice de la columna fotoanimal_url
        if foto_url:
            try:
                foto_path = os.path.join(app.static_folder, foto_url.split('/static/')[1])
                if os.path.exists(foto_path):
                    os.remove(foto_path)
                    print(f"Foto eliminada: {foto_path}")
            except Exception as e:
                print('Error al eliminar foto:', e)

        # Eliminar el animal
        cursor.execute("DELETE FROM animales WHERE animal_id = %s", (animal_id,))
        db.connection.commit()
        
        return jsonify({
            'success': True,
            'message': 'Animal eliminado correctamente'
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/fundacion/<fundacion_id>/animales', methods=['GET'])
def obtener_animales_fundacion(fundacion_id):
    try:
        cursor = db.connection.cursor()
        print(f"\nBuscando animales para fundación con ID: {fundacion_id}")
        
        # Verificamos que la fundación existe usando el fundacion_id directamente
        cursor.execute("""
            SELECT f.fundacion_id, f.nombre as nombre_fundacion
            FROM Fundaciones f 
            WHERE f.fundacion_id = %s
        """, (fundacion_id,))
        
        fundacion = cursor.fetchone()
        if not fundacion:
            print(f"Fundación no encontrada para ID: {fundacion_id}")
            return jsonify({'error': 'Fundación no encontrada'}), 404
            
        print(f"Encontrada fundación: {fundacion[1]} (ID: {fundacion_id})")
        
        # Obtenemos los animales usando el fundacion_id
        cursor.execute("""
            SELECT a.animal_id, a.nombre, a.tipo_animal, a.genero, a.raza, 
                   a.edad, a.peso, a.condicion, a.descripcion, a.disponibilidad,
                   a.fecha_ingreso, a.fotoanimal_url
            FROM animales a
            WHERE a.fundacion_id = %s AND a.disponibilidad = TRUE
            ORDER BY a.fecha_ingreso DESC
        """, (fundacion_id,))
        
        animales = cursor.fetchall()
        print(f"Animales encontrados: {len(animales)}")
        
        if animales:
            columns = ['animal_id', 'nombre', 'tipo_animal', 'genero', 'raza', 
                      'edad', 'peso', 'condicion', 'descripcion', 'disponibilidad',
                      'fecha_ingreso', 'fotoanimal_url']
            result = [convert_to_dict(animal, columns) for animal in animales]
            return jsonify(result)
            
        return jsonify([])
        
    except Exception as e:
        print(f"Error al obtener animales de la fundación: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Agregar rutas para servir archivos estáticos
@app.route('/static/fundaciones/<path:filename>')
def serve_fundacion_image(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER_FUNDACIONES'], filename)

@app.route('/static/animales/<path:filename>')
def serve_animal_image(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER_ANIMALES'], filename)

print("STATIC FOLDER ABSOLUTE PATH:", app.static_folder)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
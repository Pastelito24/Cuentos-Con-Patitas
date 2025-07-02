from flask import Flask, render_template, request, current_app, redirect, url_for, flash, jsonify, send_from_directory, make_response
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
from app.historial_donacion import historial_bp
from app.donantes_fundacion import donantes_bp
from app.modelo_adopcion_usuario import registrar_adopcion, enviar_correo_adopcion, listar_adopciones_por_fundacion, actualizar_estado_adopcion, obtener_adopcion_en_proceso_o_reciente

app = create_app()
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])
app.config.from_object(configu['desarrolloConfig'])
app.secret_key = 'cerrado123456'
# Configuración de la cookie de sesión para desarrollo
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_SECURE'] = False
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_DOMAIN'] = None
app.config['SESSION_COOKIE_PATH'] = '/'
app.config['PERMANENT_SESSION_LIFETIME'] = 1800  # 30 minutos

db = MySQL(app)
app.mysql = db

# modelos
from app.modelo_usuario import Modelo_usuario
from app.modelo_fundacion import Modelo_fundacion
from app.modelo_eventos import Modelo_eventos

# entidades
from app.entidades.usuario import Usuario

# flask-login setup
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
login_manager.session_protection = 'strong'

# Configuración de carpetas estáticas
UPLOAD_FOLDER_FUNDACIONES = os.path.join(os.path.dirname(__file__), 'static', 'fundaciones')
UPLOAD_FOLDER_ANIMALES = os.path.join(os.path.dirname(__file__), 'static', 'animales')
UPLOAD_FOLDER_USUARIOS = os.path.join(os.path.dirname(__file__), 'static', 'usuarios')
UPLOAD_FOLDER_EVENTOS = os.path.join(os.path.dirname(__file__), 'static', 'eventos')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

app.config['UPLOAD_FOLDER_FUNDACIONES'] = UPLOAD_FOLDER_FUNDACIONES
app.config['UPLOAD_FOLDER_ANIMALES'] = UPLOAD_FOLDER_ANIMALES
app.config['UPLOAD_FOLDER_USUARIOS'] = UPLOAD_FOLDER_USUARIOS
app.config['UPLOAD_FOLDER_EVENTOS'] = UPLOAD_FOLDER_EVENTOS

# Asegurarse de que las carpetas existan
os.makedirs(UPLOAD_FOLDER_FUNDACIONES, exist_ok=True)
os.makedirs(UPLOAD_FOLDER_ANIMALES, exist_ok=True)
os.makedirs(UPLOAD_FOLDER_USUARIOS, exist_ok=True)
os.makedirs(UPLOAD_FOLDER_EVENTOS, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@login_manager.user_loader
def load_user(user_id):
    # Buscar usuario normal
    cursor = db.connection.cursor()
    sql = "SELECT usuario_id, cedula, contrasena, rol, nombre, telefono, email, direccion, edad, fundacion_id, usuariofoto_url FROM usuarios WHERE cedula = %s"
    cursor.execute(sql, (user_id,))
    row = cursor.fetchone()
    if row:
        user = Usuario(
            usuario_id=row[0],
            cedula=row[1],
            contrasena=row[2],
            rol=row[3],
            nombre=row[4],
            telefono=row[5],
            email=row[6],
            direccion=row[7],
            edad=row[8],
            fundacion_id=row[9],
            usuariofoto_url=row[10]
        )
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
            user = Usuario(cedula=data['cedula'], contrasena=data['password'])
            usuario_logeado = Modelo_usuario.comprobar_user(db, user)
            if usuario_logeado is not None:
                print("Usuario logueado encontrado:", usuario_logeado.__dict__)
                login_user(usuario_logeado, remember=True)
                print("Usuario logueado con Flask-Login. ID:", usuario_logeado.get_id())
                return jsonify({
                    'status': 'success',
                    'message': 'Login exitoso',
                    'user': {
                        'usuario_id': usuario_logeado.usuario_id,
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
                'descripcion': data.get('descripcion', ''),
                'banco': data.get('banco', None),
                'tipo_cuenta': data.get('tipo_cuenta', None),
                'numero_cuenta': data.get('numero_cuenta', None),
                'titular_cuenta': data.get('titular_cuenta', None),
                'telefono_contacto': data.get('telefono_contacto', None)
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
                cedula=data['documentNumber'],
                contrasena=data['password'],
                rol=data.get('rol', 'Usuario'),
                nombre=data['username'],
                telefono=data['phone'],
                email=data['email'],
                direccion=data['address'],
                edad=edad,
                fundacion_id=fundacion_id
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
    cursor.execute("SELECT fundacion_id, nombre, direccion, telefono, email, persona_acargo, foto_url, descripcion, banco, tipo_cuenta, numero_cuenta, titular_cuenta, telefono_contacto FROM Fundaciones")
    fundaciones = cursor.fetchall()
    # Recupera todas las filas de la consulta y las convierte en una lista de datos de cada columna
    keys = [desc[0] for desc in cursor.description]
    # Convierte cada fila en un diccionario con los nombres de las columnas como claves
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
                   persona_acargo, foto_url, descripcion, banco, tipo_cuenta, numero_cuenta, titular_cuenta, telefono_contacto
            FROM Fundaciones 
            WHERE nit = %s
        """, (current_user.nit,))
        fundacion = cursor.fetchone()
        if fundacion:
            keys = ['nit', 'nombre', 'direccion', 'telefono', 'email', 
                   'persona_acargo', 'foto_url', 'descripcion', 'banco', 'tipo_cuenta', 'numero_cuenta', 'titular_cuenta', 'telefono_contacto']
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

@app.route('/api/actualizar_fundacion', methods=['POST'])
def actualizar_fundacion():
    # Se usa current_user se usa para acceder a los datos de la fundación
    if not hasattr(current_user, 'nit'):
        return jsonify({'success': False, 'error': 'No autorizado'}), 403

    datos_actualizar = request.get_json()
    nit_fundacion = current_user.get_id()

    exito = Modelo_fundacion.actualizar_fundacion(db, nit_fundacion, datos_actualizar)

    if exito:
        fundacion_actualizada = Modelo_fundacion.obtener_fundacion(db, nit_fundacion)
        return jsonify({
            'success': True, 
            'message': 'Datos de la fundación actualizados con éxito', 
            'fundacion': fundacion_actualizada
        })
    else:
        return jsonify({'success': False, 'error': 'Error al actualizar los datos de la fundación'}), 500

@app.route('/api/eliminar_fundacion', methods=['DELETE'])
def eliminar_fundacion():
    # Se usa current_user se usa para acceder a los datos de la fundación
    if not hasattr(current_user, 'nit'):
        return jsonify({'success': False, 'error': 'No autorizado'}), 403

    nit_fundacion = current_user.get_id()
    
    # Primero, eliminar todos los animales de la fundación
    try:
        cursor = db.connection.cursor()
        cursor.execute("DELETE FROM Animales WHERE fundacion_id = %s", (nit_fundacion,))
        db.connection.commit()
    except Exception as ex:
        print('Error al eliminar animales de la fundación:', ex)
        db.connection.rollback()
        return jsonify({'success': False, 'error': 'Error al eliminar los animales de la fundación'}), 500

    # Luego, eliminar la fundación
    exito = Modelo_fundacion.eliminar_fundacion(db, nit_fundacion)

    if exito:
        return jsonify({
            'success': True, 
            'message': 'Fundación eliminada con éxito'
        })
    else:
        return jsonify({'success': False, 'error': 'Error al eliminar la fundación'}), 500

@app.route('/api/agregar_animal', methods=['POST'])
def agregar_animal():
    if not hasattr(current_user, 'nit'):
        return jsonify({'success': False, 'error': 'No autorizado'}), 403
    
    try:
        data = request.form
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
        
        # Insertar animal sin foto primero para obtener el ID
        sql = """
            INSERT INTO animales (
                fundacion_id, nombre, tipo_animal, edad, peso, 
                condicion, descripcion, fecha_ingreso, 
                disponibilidad, genero, raza
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, CURRENT_DATE, %s, %s, %s)
        """
        disponibilidad = data.get('disponibilidad') == 'true'
        cursor.execute(sql, (
            fundacion_id, data['nombre'], data['tipo_animal'].lower(), int(data['edad']),
            float(data['peso']), data.get('condicion', ''), data.get('descripcion', ''),
            disponibilidad, data['genero'].lower(), data.get('raza', '')
        ))
        db.connection.commit()
        animal_id = cursor.lastrowid

        # Ahora, manejar la foto
        fotoanimal_url = None
        if 'foto' in request.files:
            file = request.files['foto']
            if file and allowed_file(file.filename):
                filename = secure_filename(f"{animal_id}_{file.filename}")
                filepath = os.path.join(app.config['UPLOAD_FOLDER_ANIMALES'], filename)
                file.save(filepath)
                fotoanimal_url = f"/static/animales/{filename}"
                
                # Actualizar el registro del animal con la URL de la foto
                cursor.execute("UPDATE animales SET fotoanimal_url = %s WHERE animal_id = %s", (fotoanimal_url, animal_id))
                db.connection.commit()

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
        data = request.form
        cursor = db.connection.cursor()

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

        # Manejar la foto si se sube una nueva
        if 'foto' in request.files:
            file = request.files['foto']
            if file and allowed_file(file.filename):
                # Opcional: eliminar la foto antigua
                # ...
                filename = secure_filename(f"{animal_id}_{file.filename}")
                filepath = os.path.join(app.config['UPLOAD_FOLDER_ANIMALES'], filename)
                file.save(filepath)
                fotoanimal_url = f"/static/animales/{filename}"
                cursor.execute("UPDATE animales SET fotoanimal_url = %s WHERE animal_id = %s", (fotoanimal_url, animal_id))

        # Actualizar los datos del animal
        disponibilidad = data.get('disponibilidad') == 'true'
        cursor.execute("""
            UPDATE animales 
            SET nombre = %s, tipo_animal = %s, genero = %s, raza = %s,
                edad = %s, peso = %s, condicion = %s, descripcion = %s,
                disponibilidad = %s
            WHERE animal_id = %s
            """, (
                data['nombre'], data['tipo_animal'].lower(), data['genero'].lower(),
                data.get('raza', ''), int(data['edad']), float(data['peso']),
                data.get('condicion', ''), data.get('descripcion', ''),
                disponibilidad, animal_id
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

# ===============================================
# ============ CRUD USUARIO (MI CUENTA) =========
# ===============================================

@app.route('/api/mi_cuenta', methods=['GET'])
def mi_cuenta():
    print("=== DEBUG MI CUENTA ===")
    print("current_user:", current_user)
    print("is_authenticated:", current_user.is_authenticated)
    print("get_id:", current_user.get_id())
    print("hasattr nit:", hasattr(current_user, 'nit'))
    print("======================")
    
    if not current_user.is_authenticated or hasattr(current_user, 'nit'):
        return jsonify({'success': False, 'error': 'No autorizado'}), 403

    usuario = Modelo_usuario.obtener_usuario(db, current_user.get_id())
    if usuario:
        usuario_dict = {
            'cedula': usuario.cedula,
            'nombre': usuario.nombre,
            'telefono': usuario.telefono,
            'email': usuario.email,
            'direccion': usuario.direccion,
            'edad': usuario.edad,
            'usuariofoto_url': usuario.usuariofoto_url,
        }
        return jsonify({'success': True, 'usuario': usuario_dict})
    return jsonify({'success': False, 'error': 'Usuario no encontrado'}), 404


@app.route('/api/actualizar_mi_cuenta', methods=['POST'])
def actualizar_mi_cuenta():
    if not current_user.is_authenticated or hasattr(current_user, 'nit'):
        return jsonify({'success': False, 'error': 'No autorizado'}), 403

    datos_actualizar = request.form.to_dict()
    
    # Manejar subida de foto
    if 'foto' in request.files:
        file = request.files['foto']
        if file and file.filename != '' and allowed_file(file.filename):
            filename = secure_filename(f"{current_user.get_id()}_usuario.{file.filename.rsplit('.', 1)[1].lower()}")
            filepath = os.path.join(app.config['UPLOAD_FOLDER_USUARIOS'], filename)
            
            # Eliminar foto antigua si existe
            usuario_actual = Modelo_usuario.obtener_usuario(db, current_user.get_id())
            if usuario_actual and usuario_actual.usuariofoto_url:
                try:
                    antigua_foto_path = os.path.join(current_app.root_path, '..', usuario_actual.usuariofoto_url.lstrip('/'))
                    if os.path.exists(antigua_foto_path):
                        os.remove(antigua_foto_path)
                except Exception as e:
                    print(f"Error eliminando foto antigua de usuario: {e}")

            file.save(filepath)
            datos_actualizar['usuariofoto_url'] = f"/static/usuarios/{filename}"
        elif file.filename != '':
            return jsonify({'success': False, 'error': 'Tipo de archivo no permitido'}), 400

    exito = Modelo_usuario.actualizar_usuario(db, current_user.get_id(), datos_actualizar)
    
    if exito:
        usuario_actualizado = Modelo_usuario.obtener_usuario(db, current_user.get_id())
        usuario_dict = {
            'cedula': usuario_actualizado.cedula,
            'nombre': usuario_actualizado.nombre,
            'telefono': usuario_actualizado.telefono,
            'email': usuario_actualizado.email,
            'direccion': usuario_actualizado.direccion,
            'edad': usuario_actualizado.edad,
            'usuariofoto_url': usuario_actualizado.usuariofoto_url
        }
        return jsonify({'success': True, 'message': 'Datos actualizados con éxito', 'usuario': usuario_dict})
    else:
        return jsonify({'success': False, 'error': 'Error al actualizar los datos'}), 500


@app.route('/api/eliminar_mi_cuenta', methods=['DELETE'])
def eliminar_mi_cuenta():
    if not current_user.is_authenticated or hasattr(current_user, 'nit'):
        return jsonify({'success': False, 'error': 'No autorizado'}), 403
    
    cedula = current_user.get_id()
    exito = Modelo_usuario.eliminar_usuario(db, cedula)
    
    if exito:
        return jsonify({'success': True, 'message': 'Cuenta eliminada con éxito'})
    else:
        return jsonify({'success': False, 'error': 'Error al eliminar la cuenta'}), 500

# ===============================================
# ============ FIN CRUD USUARIO =================
# ===============================================

@app.route('/static/usuarios/<path:filename>')
def serve_user_image(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER_USUARIOS'], filename)

@app.route('/static/eventos/<path:filename>')
def serve_event_image(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER_EVENTOS'], filename)

# === Rutas para Eventos ===
@app.route('/api/eventos', methods=['GET'])
def listar_eventos_fundacion_actual():
    """Lista los eventos de la fundación actualmente autenticada."""
    if not hasattr(current_user, 'nit'):
        return jsonify({'success': False, 'error': 'No autorizado'}), 403
    
    try:
        cursor = db.connection.cursor()
        cursor.execute("SELECT fundacion_id FROM Fundaciones WHERE nit = %s", (current_user.nit,))
        fundacion = cursor.fetchone()

        if not fundacion:
            return jsonify({'success': False, 'error': 'Fundación no encontrada'}), 404
            
        eventos = Modelo_eventos.listar_eventos_por_fundacion(db, fundacion[0])
        
        eventos_adaptados = [{
            'id': e['Id_evento'],
            'titulo': e['nombreEvento'],
            'fecha_hora': e['fecha_hora'],
            'lugar': e['nombrelugar'],
            'descripcion': e['Descripcion'],
            'fundacion_id': e['fundacion_id'],
            'imagen_url': e.get('evento_imagen')
        } for e in eventos]

        return jsonify({'success': True, 'eventos': eventos_adaptados})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/eventos', methods=['POST'])
def crear_evento():
    """Crea un nuevo evento para la fundación autenticada."""
    if not hasattr(current_user, 'nit'):
        return jsonify({'success': False, 'error': 'No autorizado'}), 403
    
    try:
        datos_form = request.form
        datos_evento_modelo = {
            'nombreEvento': datos_form.get('titulo'),
            'nombrelugar': datos_form.get('lugar'),
            'fecha': datos_form.get('fecha_hora'),
            'Descripcion': datos_form.get('descripcion'),
            'evento_imagen': None
        }

        required_fields = ['nombreEvento', 'nombrelugar', 'fecha', 'Descripcion']
        if not all(datos_evento_modelo.get(field) for field in required_fields):
            return jsonify({'success': False, 'error': 'Todos los campos son obligatorios'}), 400
        
        nuevo_id = Modelo_eventos.crear_evento(db, datos_evento_modelo, current_user.nit)
        
        if not nuevo_id:
            return jsonify({'success': False, 'error': 'No se pudo crear el evento en la base de datos'}), 500

        if 'imagen' in request.files:
            file = request.files['imagen']
            if file and allowed_file(file.filename):
                filename = secure_filename(f"evento_{nuevo_id}.{file.filename.rsplit('.', 1)[1].lower()}")
                filepath = os.path.join(app.config['UPLOAD_FOLDER_EVENTOS'], filename)
                file.save(filepath)
                imagen_url = f"/static/eventos/{filename}"
                Modelo_eventos.actualizar_evento(db, nuevo_id, {'evento_imagen': imagen_url})

        evento_creado_raw = Modelo_eventos.obtener_evento(db, nuevo_id)
        evento_creado = {
            'id': evento_creado_raw['Id_evento'],
            'titulo': evento_creado_raw['nombreEvento'],
            'fecha_hora': evento_creado_raw['fecha_hora'],
            'lugar': evento_creado_raw['nombrelugar'],
            'descripcion': evento_creado_raw['Descripcion'],
            'imagen_url': evento_creado_raw.get('evento_imagen')
        }
        return jsonify({'success': True, 'message': 'Evento creado con éxito', 'evento': evento_creado}), 201

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/eventos/<int:evento_id>', methods=['PUT'])
def actualizar_evento(evento_id):
    """Actualiza un evento existente."""
    if not hasattr(current_user, 'nit'):
        return jsonify({'success': False, 'error': 'No autorizado'}), 403

    try:
        # Verificación de propiedad del evento
        cursor = db.connection.cursor()
        cursor.execute("SELECT fundacion_id FROM Fundaciones WHERE nit = %s", (current_user.nit,))
        fundacion = cursor.fetchone()
        evento = Modelo_eventos.obtener_evento(db, evento_id)
        
        if not fundacion or not evento or str(evento['fundacion_id']) != str(fundacion[0]):
             return jsonify({'success': False, 'error': 'No autorizado para modificar este evento'}), 403

        # Lógica de actualización
        datos_form = request.form
        datos_actualizar = {
            'nombreEvento': datos_form.get('titulo'),
            'nombrelugar': datos_form.get('lugar'),
            'fecha': datos_form.get('fecha_hora'),
            'Descripcion': datos_form.get('descripcion'),
        }
        
        if 'imagen' in request.files:
            file = request.files['imagen']
            if file and allowed_file(file.filename):
                if evento.get('evento_imagen'):
                    try:
                        old_path = os.path.join(app.static_folder, evento['evento_imagen'].split('/static/')[1])
                        if os.path.exists(old_path): os.remove(old_path)
                    except Exception as e: print(f"Error al eliminar imagen antigua: {e}")
                
                filename = secure_filename(f"evento_{evento_id}.{file.filename.rsplit('.', 1)[1].lower()}")
                filepath = os.path.join(app.config['UPLOAD_FOLDER_EVENTOS'], filename)
                file.save(filepath)
                datos_actualizar['evento_imagen'] = f"/static/eventos/{filename}"

        exito = Modelo_eventos.actualizar_evento(db, evento_id, datos_actualizar)
        
        if exito:
            evento_actualizado_raw = Modelo_eventos.obtener_evento(db, evento_id)
            evento_actualizado = {
                'id': evento_actualizado_raw['Id_evento'],
                'titulo': evento_actualizado_raw['nombreEvento'],
                'fecha_hora': evento_actualizado_raw['fecha_hora'],
                'lugar': evento_actualizado_raw['nombrelugar'],
                'descripcion': evento_actualizado_raw['Descripcion'],
                'imagen_url': evento_actualizado_raw.get('evento_imagen')
            }
            return jsonify({'success': True, 'message': 'Evento actualizado', 'evento': evento_actualizado})
        else:
            return jsonify({'success': False, 'error': 'Error al actualizar el evento'}), 500
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/eventos/<int:evento_id>', methods=['DELETE'])
def eliminar_evento(evento_id):
    """Elimina un evento existente."""
    if not hasattr(current_user, 'nit'):
        return jsonify({'success': False, 'error': 'No autorizado'}), 403
    
    try:
        # Verificación de propiedad
        cursor = db.connection.cursor()
        cursor.execute("SELECT fundacion_id FROM Fundaciones WHERE nit = %s", (current_user.nit,))
        fundacion = cursor.fetchone()
        evento = Modelo_eventos.obtener_evento(db, evento_id)

        if not fundacion or not evento or str(evento['fundacion_id']) != str(fundacion[0]):
            return jsonify({'success': False, 'error': 'No autorizado para eliminar este evento'}), 403

        # Lógica de borrado de imagen
        if evento.get('evento_imagen'):
            try:
                image_path = os.path.join(app.static_folder, evento['evento_imagen'].split('/static/')[1])
                if os.path.exists(image_path):
                    os.remove(image_path)
            except Exception as e:
                print(f"Error al eliminar la imagen del evento: {e}")

        # Lógica de borrado de BD
        if Modelo_eventos.eliminar_evento(db, evento_id):
            return jsonify({'success': True, 'message': 'Evento eliminado correctamente'})
        else:
            return jsonify({'success': False, 'error': 'No se pudo eliminar el evento'})
            
    except Exception as e:
        db.connection.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

#EVENTOS INICIO

@app.route('/api/eventos_inicio', methods=['GET'])
def eventos_inicio():
    """
    Ruta para obtener eventos para mostrar en la página de inicio con rotación.
    Excluye fundacion_id e Id_evento como solicitó el usuario.
    """
    try:
        cursor = db.connection.cursor()
        sql = """
            SELECT f.nombre as nombre_fundacion, e.nombreEvento, e.nombrelugar, e.fecha, e.Descripcion, e.evento_imagen 
            FROM Eventos e
            JOIN Fundaciones f ON e.fundacion_id = f.fundacion_id
            ORDER BY e.fecha DESC
        """
        cursor.execute(sql)
        rows = cursor.fetchall()
        eventos = []
        for row in rows:
            eventos.append({
                'nombre_fundacion': row[0],
                'nombreEvento': row[1],
                'nombrelugar': row[2],
                'fecha_hora': row[3].strftime('%Y-%m-%d %H:%M') if row[3] else None,
                'Descripcion': row[4],
                'evento_imagen': row[5]
            })
        return jsonify({'success': True, 'eventos': eventos})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

print("STATIC FOLDER ABSOLUTE PATH:", app.static_folder)

# Importar y registrar el blueprint de donaciones
def register_blueprints(app):
    from app.routes_donaciones import donaciones_bp
    app.register_blueprint(donaciones_bp)
    app.register_blueprint(historial_bp)
    app.register_blueprint(donantes_bp)

register_blueprints(app)

@app.route('/api/iniciar_pago', methods=['POST'])
def iniciar_pago():
    data = request.get_json()
    db = app.mysql
    try:
        # Validar datos mínimos
        required = ['usuario_id', 'fundacion_id', 'Tipo_Donacion', 'Descripcion', 'monto']
        for field in required:
            if not data.get(field):
                return jsonify({'status': 'error', 'message': f'Falta el campo obligatorio: {field}'}), 400
        cur = db.connection.cursor()
        cur.execute(
            '''INSERT INTO Donaciones
                (usuario_id, nombre_usuario, cedula_usuario, fundacion_id, Tipo_Donacion, fecha_donacion, Descripcion, estado_pago, monto, moneda)
               VALUES (%s, %s, %s, %s, %s, CURDATE(), %s, %s, %s, %s)''',
            (
                data['usuario_id'],
                data.get('nombre_usuario', ''),
                data.get('cedula_usuario', ''),
                data['fundacion_id'],
                data['Tipo_Donacion'],
                data['Descripcion'],
                'pendiente',
                data['monto'],
                data.get('moneda', 'COP')
            )
        )
        db.connection.commit()
        donacion_id = cur.lastrowid
        cur.close()
        # Simula una URL de pago (en integración real, aquí iría la URL de la pasarela)
        url_pago = f"https://fake-pagos.com/pagar/{donacion_id}"
        return jsonify({'status': 'success', 'donacion_id': donacion_id, 'url_pago': url_pago, 'message': 'Donación registrada, procede al pago.'})
    except Exception as e:
        print('ERROR EN INICIAR PAGO:', e)
        return jsonify({'status': 'error', 'message': str(e)}), 500
# ===============================================
# ============ Registro de adopción ============
# ===============================================
# Solicitar adopción
@app.route('/api/solicitar_adopcion', methods=['POST'])
def solicitar_adopcion():
    data = request.get_json()
    # Primero registrar la adopción en la base de datos
    exito_registro, mensaje_registro = registrar_adopcion(db, data)
    if not exito_registro:
        return jsonify({'success': False, 'error': mensaje_registro}), 400
    # Luego enviar el correo
    exito, mensaje = enviar_correo_adopcion(db, data)
    if exito:
        return jsonify({'success': True, 'message': mensaje})
    else:
        return jsonify({'success': False, 'error': mensaje}), 400

# Listar adopciones por fundación --------
@app.route('/api/adopciones_fundacion', methods=['GET'])
def api_listar_adopciones_fundacion():
    if not hasattr(current_user, 'nit'):
        return jsonify({'success': False, 'error': 'No autorizado'}), 403
    try:
        cursor = db.connection.cursor()
        cursor.execute("SELECT fundacion_id FROM Fundaciones WHERE nit = %s", (current_user.nit,))
        fundacion = cursor.fetchone()
        if not fundacion:
            return jsonify({'success': False, 'error': 'Fundación no encontrada'}), 404
        fundacion_id = fundacion[0]
        adopciones = listar_adopciones_por_fundacion(db, fundacion_id)
        return jsonify({'success': True, 'adopciones': adopciones})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Actualizar estado de adopción --------
@app.route('/api/actualizar_estado_adopcion', methods=['POST'])
def api_actualizar_estado_adopcion():
    if not hasattr(current_user, 'nit'):
        return jsonify({'success': False, 'error': 'No autorizado'}), 403
    data = request.get_json()
    adopcion_id = data.get('adopcion_id')
    nuevo_estado = data.get('nuevo_estado')
    if not adopcion_id or nuevo_estado not in ['adoptado', 'no adoptado']:
        return jsonify({'success': False, 'error': 'Datos inválidos'}), 400
    exito, mensaje = actualizar_estado_adopcion(db, adopcion_id, nuevo_estado)
    if exito:
        return jsonify({'success': True, 'message': mensaje})
    else:
        return jsonify({'success': False, 'error': mensaje}), 400

@app.route('/api/adopcion_actual/<int:animal_id>', methods=['GET'])
def api_adopcion_actual(animal_id):
    adopcion = obtener_adopcion_en_proceso_o_reciente(db, animal_id)
    if adopcion:
        return jsonify({'success': True, 'adopcion': adopcion})
    else:
        return jsonify({'success': False, 'error': 'No se encontró adopción para este animal'}), 404

@app.route('/api/usuario', methods=['GET'])
def obtener_usuario():
    cedula = request.args.get('cedula')
    if not cedula:
        return jsonify({'error': 'Falta la cédula'}), 400
    usuario = Modelo_usuario.obtener_usuario(db, cedula)
    if usuario:
        return jsonify({
            'cedula': usuario.cedula,
            'nombre': usuario.nombre,
            'email': usuario.email,
            'telefono': usuario.telefono,
            'direccion': usuario.direccion,
            'edad': usuario.edad,
            'usuariofoto_url': usuario.usuariofoto_url
        })
    return jsonify({'error': 'Usuario no encontrado'}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5000)

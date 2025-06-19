from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
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

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'static', 'fundaciones')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

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
                'contrasena': data['contrasena']
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
    cursor.execute("SELECT nit, nombre, direccion, telefono, email, persona_acargo, foto_url FROM Fundaciones")
    fundaciones = cursor.fetchall()
    keys = [desc[0] for desc in cursor.description]
    return jsonify([dict(zip(keys, row)) for row in fundaciones])

@app.route('/api/fundacion/<nit>/animales', methods=['GET'])
def animales_de_fundacion(nit):
    cursor = db.connection.cursor()
    cursor.execute("SELECT * FROM animales WHERE fundacion_id = %s", (nit,))
    animales = cursor.fetchall()
    keys = [desc[0] for desc in cursor.description]
    return jsonify([dict(zip(keys, row)) for row in animales])

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
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
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

print("STATIC FOLDER ABSOLUTE PATH:", app.static_folder)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
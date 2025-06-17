from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS
from app import create_app
from app.configuracion import configu
from datetime import datetime
import re
import traceback
from werkzeug.security import check_password_hash

app = create_app()
CORS(app)  # Habilitar CORS para todas las rutas
app.config.from_object(configu['desarrolloConfig'])
app.secret_key = 'cerrado123456'

db = MySQL(app)

# modelos
from app.modelo_usuario import Modelo_usuario
from app.modelo_fundacion import Modelo_fundacion

# entidades
from app.entidades.usuario import Usuario

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
            cursor.execute("SELECT nit, contrasena FROM Fundaciones WHERE nit = %s", (data['nit'],))
            fundacion = cursor.fetchone()
            if fundacion and check_password_hash(fundacion[1], data['password']):
                return jsonify({
                    'status': 'success',
                    'message': 'Login exitoso',
                    'fundacion': {
                        'nit': fundacion[0]
                    }
                }), 200
            else:
                return jsonify({'status': 'error', 'message': 'Usuario o contraseña incorrectos'}), 401
        else:
            user = Usuario(data['email'], data['password'])
            usuario_logeado = Modelo_usuario.comprobar_user(db, user)
            if usuario_logeado is not None:
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

if __name__ == '__main__':
    app.run(debug=True, port=5000)
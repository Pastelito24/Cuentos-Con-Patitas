from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS
from app import create_app
from app.configuracion import configu
from datetime import datetime

app = create_app()
CORS(app)  # Habilitar CORS para todas las rutas
app.config.from_object(configu['desarrolloConfig'])
app.secret_key = 'cerrado123456'

db = MySQL(app)

# modelos
from app.modelo_usuario import Modelo_usuario

# entidades
from app.entidades.usuario import Usuario

@app.route('/')
def home():
    return redirect(url_for('login'))

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        user = Usuario(data['email'], data['password'])
        usuario_logeado = Modelo_usuario.comprobar_user(db, user)
        
        if usuario_logeado is not None:
            return jsonify({
                'status': 'success',
                'message': 'Login exitoso',
                'user': {
                    'cedula': usuario_logeado.cedula
                }
            }), 200
        else:
            return jsonify({
                'status': 'error',
                'message': 'Usuario o contraseña incorrectos'
            }), 401
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

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
        # Calcular edad a partir de la fecha de nacimiento (YYYY-MM-DD)
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
            None  # fundacion_id por defecto
        )
        creado = Modelo_usuario.crear_usuario(db, user)
        if creado:
            return jsonify({'status': 'success', 'message': 'Usuario registrado correctamente', 'user': data}), 201
        else:
            return jsonify({'status': 'error', 'message': 'No se pudo registrar el usuario'}), 400
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)

from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS
from app import create_app
from app.configuracion import configu

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

if __name__ == '__main__':
    app.run(debug=True, port=5000)

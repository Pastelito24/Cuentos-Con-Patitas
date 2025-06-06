from flask import Flask, jsonify, request
from . import conectar_db  # Importar la función para la conexion


def register_routes(app):
    @app.route('/')
    def index():
        return 'API Flask funcionando ✅'

    @app.route('/api/cuentos', methods=['GET'])
    def get_cuentos():
        cuentos = [{"titulo": "Cuento 1"}, {"titulo": "Cuento 2"}]
        return jsonify(cuentos)

    @app.route('/api/cuentos', methods=['POST'])
    def add_cuento():
        data = request.get_json()
        return jsonify(data), 201

    # Registro y conexion del usuario con la base de datos
    @app.route('/registro', methods=['POST'])
    def registrar_usuario():
        """Registrar un nuevo usuario en la base de datos"""
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No se recibió JSON válido'}), 400
        
        usuario_id = data.get('usuario_id')
        cedula = data.get('cedula')
        contrasena = data.get('contrasena')
        nombre = data.get('nombre')
        telefono = data.get('telefono')
        email = data.get('email')
        direccion = data.get('direccion')
        edad = data.get('edad')
        fecha_registro = data.get('fecha_registro')
        fundacion_id = data.get('fundacion_id')

        if not all([usuario_id, cedula, contrasena, nombre, telefono, email, direccion, edad, fecha_registro, fundacion_id]):
            return jsonify({'error': 'Faltan datos'}), 400

        conn = conectar_db()
        cursor = conn.cursor()

        sql = '''INSERT INTO usuarios (usuario_id, cedula, contrasena, nombre, telefono, email, direccion, edad, fecha_registro, fundacion_id) 
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)'''
        valores = (usuario_id, cedula, contrasena, nombre, telefono, email, direccion, edad, fecha_registro, fundacion_id)

        cursor.execute(sql, valores)
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({'mensaje': 'Usuario registrado correctamente'}), 201


        # Ingreso al login con los datos de cedula y contrasena
        @app.route('/login', methods=['POST'])
    def login():
        """Validar credenciales y permitir acceso"""
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No se recibió JSON válido'}), 400

        cedula = data.get('cedula')
        contrasena = data.get('contrasena')

        if not cedula or not contrasena:
            return jsonify({'error': 'Faltan datos'}), 400

        conn = conectar_db()
        cursor = conn.cursor(dictionary=True)

        sql = "SELECT * FROM usuarios WHERE cedula = %s AND contrasena = %s"
        cursor.execute(sql, (cedula, contrasena))
        usuario = cursor.fetchone()

        cursor.close()
        conn.close()

        if usuario:
            usuario.pop('contrasena', None)  # Remover la contraseña antes de enviarla
            return jsonify({'mensaje': 'Login exitoso', 'usuario': usuario}), 200
        else:
            return jsonify({'error': 'Credenciales incorrectas'}), 401




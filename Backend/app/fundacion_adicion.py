from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.configuracion import configu
import MySQLdb

fundacion_bp = Blueprint('fundacion_bp', __name__)

# Nueva función para obtener la conexión

def get_db_connection():
    conf = configu['desarrolloConfig']
    return MySQLdb.connect(
        host=conf.MYSQL_HOST,
        user=conf.MYSQL_USER,
        passwd=conf.MYSQL_PASSWORD,
        db=conf.MYSQL_DB,
        port=conf.MYSQL_PORT
    )

@fundacion_bp.route('/api/mi_fundacion', methods=['GET'])
@login_required
def mi_fundacion():
    if current_user.rol != 'fundacion':
        return jsonify({'error': 'Solo fundaciones pueden acceder'}), 403
    nit = current_user.nit
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM fundaciones WHERE nit = %s", (nit,))
    fundacion = cursor.fetchone()
    if not fundacion:
        conn.close()
        return jsonify({})
    keys = [desc[0] for desc in cursor.description]
    conn.close()
    return jsonify(dict(zip(keys, fundacion)))

@fundacion_bp.route('/api/crear_fundacion', methods=['POST'])
@login_required
def crear_fundacion():
    if current_user.rol != 'fundacion':
        return jsonify({'error': 'Solo fundaciones pueden crear fundación'}), 403
    if current_user.fundacion_id:
        return jsonify({'error': 'Ya tienes una fundación registrada'}), 400
    data = request.get_json()
    conn = get_db_connection()
    cursor = conn.cursor()
    sql = """
        INSERT INTO fundaciones (nit, nombre, direccion, telefono, email, persona_acargo, contrasena, foto_url)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """
    cursor.execute(sql, (
        data['nit'],
        data['nombre'],
        data['direccion'],
        data['telefono'],
        data['email'],
        data['persona_acargo'],
        data['contrasena'],
        data.get('foto_url', None)
    ))
    conn.commit()
    fundacion_id = cursor.lastrowid
    cursor.execute("UPDATE usuarios SET fundacion_id = %s WHERE usuario_id = %s", (fundacion_id, current_user.usuario_id))
    conn.commit()
    conn.close()
    return jsonify({'success': True, 'fundacion_id': fundacion_id})

@fundacion_bp.route('/api/agregar_animal', methods=['POST'])
@login_required
def agregar_animal():
    if current_user.rol != 'fundacion' or not current_user.fundacion_id:
        return jsonify({'error': 'No autorizado'}), 403
    data = request.get_json()
    conn = get_db_connection()
    cursor = conn.cursor()
    sql = """
        INSERT INTO animales (fundacion_id, nombre, especie, edad, descripcion, imagen_url)
        VALUES (%s, %s, %s, %s, %s, %s)
    """
    cursor.execute(sql, (
        current_user.fundacion_id,
        data['nombre'],
        data['especie'],
        data['edad'],
        data['descripcion'],
        data['imagen_url']
    ))
    conn.commit()
    animal_id = cursor.lastrowid
    conn.close()
    return jsonify({'success': True, 'animal_id': animal_id})

@fundacion_bp.route('/api/animales_de_fundacion', methods=['GET'])
@login_required
def animales_de_fundacion():
    if current_user.rol != 'fundacion' or not current_user.fundacion_id:
        return jsonify({'error': 'No autorizado'}), 403
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM animales WHERE fundacion_id = %s", (current_user.fundacion_id,))
    animales = cursor.fetchall()
    keys = [desc[0] for desc in cursor.description]
    conn.close()
    return jsonify([dict(zip(keys, row)) for row in animales]) 
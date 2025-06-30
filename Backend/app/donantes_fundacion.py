from flask import Blueprint, jsonify
from flask_login import current_user
from flask import current_app

donantes_bp = Blueprint('donantes', __name__)

@donantes_bp.route('/api/donantes_fundacion', methods=['GET'])
def donantes_fundacion():
    if not current_user.is_authenticated or not hasattr(current_user, 'nit'):
        return jsonify({'success': False, 'error': 'No autorizado'}), 403

    db = current_app.mysql
    # Obtener fundacion_id a partir del NIT
    cursor = db.connection.cursor()
    cursor.execute("SELECT fundacion_id FROM Fundaciones WHERE nit = %s", (current_user.nit,))
    fundacion = cursor.fetchone()
    if not fundacion:
        return jsonify({'success': False, 'error': 'Fundación no encontrada'}), 404
    fundacion_id = fundacion[0]

    # Traer donaciones con datos del usuario
    cursor.execute('''
        SELECT d.donacion_id, d.fecha_donacion, d.monto, d.moneda, d.Tipo_Donacion, d.Descripcion, d.estado_pago,
               u.nombre, u.usuariofoto_url
        FROM Donaciones d
        LEFT JOIN usuarios u ON d.usuario_id = u.usuario_id
        WHERE d.fundacion_id = %s
        ORDER BY d.fecha_donacion DESC
    ''', (fundacion_id,))
    rows = cursor.fetchall()
    columns = [desc[0] for desc in cursor.description]
    donantes = [dict(zip(columns, row)) for row in rows]
    return jsonify({'success': True, 'donantes': donantes}) 
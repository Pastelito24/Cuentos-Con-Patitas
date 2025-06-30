from flask import Blueprint, jsonify
from flask_login import current_user
from app.modelo_usuario import Modelo_usuario
from app.modelos.donaciones import Donacion
from flask import current_app

historial_bp = Blueprint('historial', __name__)

@historial_bp.route('/api/historial_donaciones', methods=['GET'])
def historial_donaciones():
    if not current_user.is_authenticated or hasattr(current_user, 'nit'):
        return jsonify({'success': False, 'error': 'No autorizado'}), 403

    db = current_app.mysql
    usuario_id = getattr(current_user, 'usuario_id', None)
    if not usuario_id:
        # Intentar buscar por cédula si no hay usuario_id
        usuario = Modelo_usuario.obtener_usuario(db, current_user.get_id())
        if usuario:
            usuario_id = usuario.usuario_id
        else:
            return jsonify({'success': False, 'error': 'Usuario no encontrado'}), 404

    donaciones = Donacion.by_usuario(db, usuario_id)
    # Adaptar los datos para el frontend
    historial = []
    for d in donaciones:
        historial.append({
            'id': d.get('id') or d.get('donacion_id'),
            'fecha': d.get('fecha_donacion'),
            'monto': d.get('monto'),
            'moneda': d.get('moneda', 'COP'),
            'tipo': d.get('Tipo_Donacion'),
            'descripcion': d.get('Descripcion'),
            'estado_pago': d.get('estado_pago', ''),
            'fundacion_id': d.get('fundacion_id'),
            'nombre_usuario': d.get('nombre_usuario'),
            'cedula_usuario': d.get('cedula_usuario'),
        })
    return jsonify({'success': True, 'historial': historial}) 
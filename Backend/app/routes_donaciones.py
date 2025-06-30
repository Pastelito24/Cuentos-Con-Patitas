from flask import Blueprint, render_template, redirect, url_for, abort, request, jsonify, current_app
from flask_login import current_user, login_required
from app.modelos.donaciones import Donacion
from app.forms import DonacionForm
from flask_cors import cross_origin
import traceback

donaciones_bp = Blueprint('donaciones', __name__, url_prefix='/donaciones')

@donaciones_bp.route('/nueva/<int:fundacion_id>', methods=['GET', 'POST', 'OPTIONS'])
@cross_origin(origins=["http://localhost:5173"], supports_credentials=True)
@login_required
def nueva_donacion(fundacion_id):
    db = current_app.mysql
    if request.method == 'OPTIONS':
        return '', 200
    if request.method == 'POST':
        # Permitir JSON o formulario
        if request.is_json:
            data = request.get_json()
        else:
            data = request.form.to_dict()
        # Validaciones básicas
        required_fields = ['nombre_usuario', 'cedula_usuario', 'Tipo_Donacion', 'Descripcion']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'status': 'error', 'message': f'Falta el campo obligatorio: {field}'}), 400
        try:
            print('Tipo_Donacion recibido:', data['Tipo_Donacion'])
            Donacion.create(db, {
                'usuario_id': data.get('usuario_id') or (current_user.id if hasattr(current_user, 'id') else current_user.get_id()),
                'nombre_usuario': data['nombre_usuario'],
                'cedula_usuario': data['cedula_usuario'],
                'fundacion_id': fundacion_id,
                'Tipo_Donacion': data['Tipo_Donacion'],
                'Descripcion': data['Descripcion']
            })
            return jsonify({'status': 'success', 'message': '¡Gracias por tu donación!'}), 200
        except Exception as e:
            print('ERROR EN DONACION:', e)
            traceback.print_exc()
            return jsonify({'status': 'error', 'message': str(e)}), 500
    # GET: Renderizar formulario tradicional (opcional)
    form = DonacionForm()
    return render_template('donaciones/nueva.html', form=form)

@donaciones_bp.route('/gracias')
def gracias():
    return "<h1>¡Gracias por tu donación! 🎉</h1>"

@donaciones_bp.route('/recibidas')
@login_required
def donaciones_recibidas():
    db = current_app.mysql
    donaciones = Donacion.by_fundacion(db, current_user.id if hasattr(current_user, 'id') else current_user.get_id())
    return render_template('donaciones/recibidas.html', donaciones=donaciones) 
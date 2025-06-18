from flask import jsonify, request
from .fundacion_adicion import fundacion_bp

def register_routes(app):
    app.register_blueprint(fundacion_bp)
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

from flask import Flask
import mysql.connector
from configuracion import Base_datos_conf
# Importar y registrar las rutas
from .routes import register_routes


# Conexión a MySQL
def conectar_db():
    return mysql.connector.connect(
        host = Base_datos_conf['host'],
        user = Base_datos_conf['user'],        
        password = Base_datos_conf['password'],
        database = Base_datos_conf['database']
    )


def create_app():
    app = Flask(__name__)

    register_routes(app)
    return app

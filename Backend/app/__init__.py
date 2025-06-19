from flask import Flask
from .routes import register_routes
import os

def create_app():
    app = Flask(
        __name__,
        static_folder=os.path.join(os.path.dirname(os.path.dirname(__file__)), 'static')
    )
    register_routes(app)
    return app

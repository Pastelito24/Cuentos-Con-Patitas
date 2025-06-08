from flask import Flask, render_template, request, redirect, url_for, flash
from configuracion import configu
from flask_mysqldb import MySQL

# modelos
from modelos.modelo_usuario import Modelo_usuario

# entidades
from modelos.entidades.usuario import Usuario

app = Flask(__name__)
app.config.from_object(configu['desarrolloConfig'])
app.secret_key = 'cerrado123456'

db = MySQL(app)

@app.route('/')
def index():
    return redirect(url_for('login'))


@app.route('/login', methods=['POST', 'GET'])
def login():
    if request.method == 'POST':
        user = Usuario(request.form['cedula'], request.form['password'])
        usuario_logeado = Modelo_usuario.comprobar_user(db, user)
        if usuario_logeado is not None:
            return redirect(url_for('inicio'))
        else:
            flash('Usuario o contraseña incorrectos')
            return render_template('pag/login.html')
    else:
        return render_template('pag/login.html')

@app.route('/index')
def inicio():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
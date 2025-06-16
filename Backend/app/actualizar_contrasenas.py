from werkzeug.security import generate_password_hash
import MySQLdb
import sys
import os

# Agrega la carpeta 'app' al path para importar configuracion.py
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'app')))

from configuracion import configu

# Usa la configuración de desarrollo
conf = configu['desarrolloConfig']

# Conexión a la base de datos
db = MySQLdb.connect(
    host=conf.MYSQL_HOST,
    user=conf.MYSQL_USER,
    passwd=conf.MYSQL_PASSWORD,
    db=conf.MYSQL_DB
)

cursor = db.cursor()

# Selecciona los usuarios con contraseñas en texto plano
cursor.execute("SELECT usuario_id, contrasena FROM usuarios")
usuarios = cursor.fetchall()

for usuario_id, contrasena in usuarios:
    # Si la contraseña ya está cifrada, la saltamos
    if contrasena.startswith("pbkdf2:sha256:"):
        continue
    # Cifra la contraseña
    hashed = generate_password_hash(contrasena)
    # Actualiza la contraseña en la base de datos
    cursor.execute(
        "UPDATE usuarios SET contrasena = %s WHERE usuario_id = %s",
        (hashed, usuario_id)
    )

# Selecciona las fundaciones con contraseñas en texto plano
cursor.execute("SELECT fundacion_id, contrasena FROM Fundaciones")
fundaciones = cursor.fetchall()

for fundacion_id, contrasena in fundaciones:
    # Si la contraseña ya está cifrada, la saltamos
    if contrasena.startswith("pbkdf2:sha256:"):
        continue
    # Cifra la contraseña
    hashed = generate_password_hash(contrasena)
    # Actualiza la contraseña en la base de datos
    cursor.execute(
        "UPDATE Fundaciones SET contrasena = %s WHERE fundacion_id = %s",
        (hashed, fundacion_id)
    )

db.commit()
cursor.close()
db.close()

print("Contraseñas actualizadas correctamente.")
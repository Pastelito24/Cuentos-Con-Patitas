from app.entidades.usuario import Usuario
from werkzeug.security import generate_password_hash, check_password_hash

class Modelo_usuario():
    # login usuario
    @classmethod
    def comprobar_user(self, db, user):
        try:
            cursor = db.connection.cursor()
            sql = "SELECT cedula, contrasena, rol, nombre, telefono, email, direccion, edad, fundacion_id FROM usuarios WHERE cedula = %s"
            cursor.execute(sql, (user.cedula,))
            row = cursor.fetchone()
            print("Consulta SQL:", sql, "Valor:", user.cedula)
            print("Resultado de la consulta:", row)
            if row is not None:
                print("Contraseña ingresada:", user.contrasena)
                print("Contraseña en BD:", row[1])
                if check_password_hash(row[1], user.contrasena):
                    print("Contraseña válida")
                    return Usuario(*row)
                else:
                    print("Contraseña inválida")
                    return None
            else:
                print("Usuario no encontrado")
                return None
        except Exception as ex:
            raise Exception(ex)
    # registrar usuario
    @classmethod
    def crear_usuario(cls, db, user):
        try:
            cursor = db.connection.cursor()
            sql = """
                INSERT INTO usuarios (cedula, contrasena, rol, nombre, telefono, email, direccion, edad, fecha_registro, fundacion_id)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, NOW(), %s)
            """
            contrasena_hash = generate_password_hash(user.contrasena)
            valores = (
                user.cedula,
                contrasena_hash,
                user.rol,
                user.nombre,
                user.telefono,
                user.email,
                user.direccion,
                user.edad,
                user.fundacion_id
            )
            cursor.execute(sql, valores)
            db.connection.commit()
            return True
        except Exception as ex:
            print('Error al crear usuario:', ex)
            return False
    # leer usuario 
    @classmethod
    def obtener_usuario(cls, db, cedula):
        try:
            cursor = db.connection.cursor()
            sql = "SELECT cedula, contrasena, rol, nombre, telefono, email, direccion, edad, fundacion_id FROM usuarios WHERE cedula = %s"
            cursor.execute(sql, (cedula,))
            row = cursor.fetchone()
            if row is not None:
                return Usuario(*row)
            return None
        except Exception as ex:
            print('Error al obtener usuario:', ex)
            return None
    # actualizar usuario
    @classmethod
    def actualizar_usuario(cls, db, cedula, datos):
        try:
            cursor = db.connection.cursor()
            sql = """
                UPDATE usuarios 
                SET nombre = %s, telefono = %s, email = %s, 
                    direccion = %s, edad = %s
                WHERE cedula = %s
            """
            cursor.execute(sql, (
                datos['nombre'],
                datos['telefono'],
                datos['email'],
                datos['direccion'],
                datos['edad'],
                cedula
            ))
            db.connection.commit()
            return True
        except Exception as ex:
            print('Error al actualizar usuario:', ex)
            return False
    # eliminar usuario
    @classmethod
    def eliminar_usuario(cls, db, cedula):
        try:
            cursor = db.connection.cursor()
            sql = "DELETE FROM usuarios WHERE cedula = %s"
            cursor.execute(sql, (cedula,))
            db.connection.commit()
            return True
        except Exception as ex:
            print('Error al eliminar usuario:', ex)
            return False
    # actualizar contraseña
    @classmethod
    def actualizar_contrasena(cls, db, cedula, nueva_contrasena):
        try:
            cursor = db.connection.cursor()
            contrasena_hash = generate_password_hash(nueva_contrasena)
            sql = "UPDATE usuarios SET contrasena = %s WHERE cedula = %s"
            cursor.execute(sql, (contrasena_hash, cedula))
            db.connection.commit()
            return True
        except Exception as ex:
            print('Error al actualizar contraseña:', ex)
            return False
    # listar usuarios
    @classmethod
    def listar_usuarios(cls, db):
        try:
            cursor = db.connection.cursor()
            sql = "SELECT cedula, contrasena, rol, nombre, telefono, email, direccion, edad, fundacion_id FROM usuarios"
            cursor.execute(sql)
            rows = cursor.fetchall()
            usuarios = []
            for row in rows:
                usuarios.append({
                    'cedula': row[0],
                    'contrasena': row[1],
                    'rol': row[2],
                    'nombre': row[3],
                    'telefono': row[4],
                    'email': row[5],
                    'direccion': row[6],
                    'edad': row[7],
                    'fundacion_id': row[8]
                })
            return usuarios
        except Exception as ex:
            print('Error al listar usuarios:', ex)
            return []
        
from app.entidades.usuario import Usuario
from werkzeug.security import generate_password_hash, check_password_hash

class Modelo_usuario():

    @classmethod
    def comprobar_user(self, db, user):
        try:
            cursor = db.connection.cursor()
            sql = "SELECT cedula, contrasena FROM usuarios WHERE cedula = %s"
            cursor.execute(sql, (user.cedula,))
            row = cursor.fetchone()
            print("Consulta SQL:", sql, "Valor:", user.cedula)
            print("Resultado de la consulta:", row)
            if row is not None:
                print("Contraseña ingresada:", user.contrasena)
                print("Contraseña en BD:", row[1])
                if check_password_hash(row[1], user.contrasena):
                    print("Contraseña válida")
                    return Usuario(row[0], row[1])
                else:
                    print("Contraseña inválida")
                    return None
            else:
                print("Usuario no encontrado")
                return None
        except Exception as ex:
            raise Exception(ex)
        
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
        
        
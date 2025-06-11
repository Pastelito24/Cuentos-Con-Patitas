from app.entidades.usuario import Usuario

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
                # TEMPORAL: comparación directa para pruebas
                if row[1] == user.contrasena:
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
        
        
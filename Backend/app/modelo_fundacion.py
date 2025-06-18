from werkzeug.security import generate_password_hash, check_password_hash

class Modelo_fundacion:
    # login fundación
    @staticmethod
    def comprobar_fundacion(db, nit, contrasena):
        try:
            cursor = db.connection.cursor()
            sql = "SELECT * FROM Fundaciones WHERE nit = %s"
            cursor.execute(sql, (nit,))
            row = cursor.fetchone()
            
            if row is not None and check_password_hash(row[6], contrasena):  # row[6] es la columna contrasena
                return {
                    'nit': row[0],
                    'nombre': row[1],
                    'direccion': row[2],
                    'telefono': row[3],
                    'email': row[4],
                    'persona_acargo': row[5]
                }
            return None
        except Exception as ex:
            print('Error al comprobar fundación:', ex)
            return None
    # crear fundación
    @staticmethod
    def crear_fundacion(db, fundacion):
        try:
            cursor = db.connection.cursor()
            contrasena_hash = generate_password_hash(fundacion['contrasena'])
            sql = """
                INSERT INTO Fundaciones (nit, nombre, direccion, telefono, email, persona_acargo, contrasena)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(sql, (
                fundacion['nit'],
                fundacion['nombre'],
                fundacion['direccion'],
                fundacion['telefono'],
                fundacion['email'],
                fundacion['persona_acargo'],
                contrasena_hash
            ))
            db.connection.commit()
            return cursor.lastrowid
        except Exception as ex:
            print('Error al crear fundación:', ex)
            return None
    # leer fundación
    @staticmethod
    def obtener_fundacion(db, nit):
        try:
            cursor = db.connection.cursor()
            sql = "SELECT nit, nombre, direccion, telefono, email, persona_acargo FROM Fundaciones WHERE nit = %s"
            cursor.execute(sql, (nit,))
            row = cursor.fetchone()
            
            if row is not None:
                return {
                    'nit': row[0],
                    'nombre': row[1],
                    'direccion': row[2],
                    'telefono': row[3],
                    'email': row[4],
                    'persona_acargo': row[5]
                }
            return None
        except Exception as ex:
            print('Error al obtener fundación:', ex)
            return None
    # actualizar fundación
    @staticmethod
    def actualizar_fundacion(db, nit, datos):
        try:
            cursor = db.connection.cursor()
            sql = """
                UPDATE Fundaciones 
                SET nombre = %s, direccion = %s, telefono = %s, 
                    email = %s, persona_acargo = %s
                WHERE nit = %s
            """
            cursor.execute(sql, (
                datos['nombre'],
                datos['direccion'],
                datos['telefono'],
                datos['email'],
                datos['persona_acargo'],
                nit
            ))
            db.connection.commit()
            return True
        except Exception as ex:
            print('Error al actualizar fundación:', ex)
            return False
    # eliminar fundación
    @staticmethod
    def eliminar_fundacion(db, nit):
        try:
            cursor = db.connection.cursor()
            sql = "DELETE FROM Fundaciones WHERE nit = %s"
            cursor.execute(sql, (nit,))
            db.connection.commit()
            return True
        except Exception as ex:
            print('Error al eliminar fundación:', ex)
            return False
    # actualizar contraseña
    @staticmethod
    def actualizar_contrasena(db, nit, nueva_contrasena):
        try:
            cursor = db.connection.cursor()
            contrasena_hash = generate_password_hash(nueva_contrasena)
            sql = "UPDATE Fundaciones SET contrasena = %s WHERE nit = %s"
            cursor.execute(sql, (contrasena_hash, nit))
            db.connection.commit()
            return True
        except Exception as ex:
            print('Error al actualizar contraseña:', ex)
            return False
    # listar fundaciones
    @staticmethod
    def listar_fundaciones(db):
        try:
            cursor = db.connection.cursor()
            sql = "SELECT nit, nombre, direccion, telefono, email, persona_acargo FROM Fundaciones"
            cursor.execute(sql)
            rows = cursor.fetchall()
            fundaciones = []
            for row in rows:
                fundaciones.append({
                    'nit': row[0],
                    'nombre': row[1],
                    'direccion': row[2],
                    'telefono': row[3],
                    'email': row[4],
                    'persona_acargo': row[5]
                })
            return fundaciones
        except Exception as ex:
            print('Error al listar fundaciones:', ex)
            return []
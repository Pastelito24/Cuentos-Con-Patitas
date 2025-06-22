from werkzeug.security import generate_password_hash, check_password_hash

class Modelo_fundacion:
    # login fundación
    @staticmethod
    def comprobar_fundacion(db, nit, contrasena):
        try:
            cursor = db.connection.cursor()
            sql = "SELECT nit, nombre, direccion, telefono, email, persona_acargo, contrasena, foto_url, descripcion FROM Fundaciones WHERE nit = %s"
            cursor.execute(sql, (nit,))
            row = cursor.fetchone()
            
            if row is not None and check_password_hash(row[6], contrasena):  # row[6] es la columna contrasena
                return {
                    'nit': row[0],
                    'nombre': row[1],
                    'direccion': row[2],
                    'telefono': row[3],
                    'email': row[4],
                    'persona_acargo': row[5],
                    'foto_url': row[7],
                    'descripcion': row[8]
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
                INSERT INTO Fundaciones (nit, nombre, direccion, telefono, email, persona_acargo, contrasena, foto_url, descripcion)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(sql, (
                fundacion['nit'],
                fundacion['nombre'],
                fundacion['direccion'],
                fundacion['telefono'],
                fundacion['email'],
                fundacion['persona_acargo'],
                contrasena_hash,
                fundacion.get('foto_url', None),
                fundacion['descripcion']
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
            sql = "SELECT nit, nombre, direccion, telefono, email, persona_acargo, foto_url, descripcion FROM Fundaciones WHERE nit = %s"
            cursor.execute(sql, (nit,))
            row = cursor.fetchone()
            
            if row is not None:
                return {
                    'nit': row[0],
                    'nombre': row[1],
                    'direccion': row[2],
                    'telefono': row[3],
                    'email': row[4],
                    'persona_acargo': row[5],
                    'foto_url': row[6],
                    'descripcion': row[7]
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
            
            update_fields = []
            valores = []

            campos_permitidos = ['nombre', 'direccion', 'telefono', 'email', 'persona_acargo', 'foto_url', 'descripcion']
            for key in campos_permitidos:
                if key in datos and datos[key] is not None:
                    update_fields.append(f"{key} = %s")
                    valores.append(datos[key])

            if not update_fields:
                if 'contrasena' not in datos or not datos['contrasena']:
                    return True

            if update_fields:
                sql = f"UPDATE Fundaciones SET {', '.join(update_fields)} WHERE nit = %s"
                valores.append(nit)
                cursor.execute(sql, tuple(valores))

            if 'contrasena' in datos and datos['contrasena']:
                contrasena_hash = generate_password_hash(datos['contrasena'])
                cursor.execute("UPDATE Fundaciones SET contrasena = %s WHERE nit = %s", (contrasena_hash, nit))
            
            db.connection.commit()
            return True
        except Exception as ex:
            print('Error al actualizar fundación:', ex)
            db.connection.rollback()
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
    # listar fundaciones
    @staticmethod
    def listar_fundaciones(db):
        try:
            cursor = db.connection.cursor()
            sql = "SELECT nit, nombre, direccion, telefono, email, persona_acargo, foto_url, descripcion FROM Fundaciones"
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
                    'persona_acargo': row[5],
                    'foto_url': row[6],
                    'descripcion': row[7]
                })
            return fundaciones
        except Exception as ex:
            print('Error al listar fundaciones:', ex)
            return []
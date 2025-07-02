from werkzeug.security import generate_password_hash, check_password_hash

class Modelo_fundacion:
    # login fundación
    @staticmethod
    def comprobar_fundacion(db, nit, contrasena):
        try:
            cursor = db.connection.cursor()
            sql = "SELECT nit, nombre, direccion, telefono, email, persona_acargo, contrasena, foto_url, descripcion, banco, tipo_cuenta, numero_cuenta, titular_cuenta, telefono_contacto FROM Fundaciones WHERE nit = %s"
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
                    'descripcion': row[8],
                    'banco': row[9],
                    'tipo_cuenta': row[10],
                    'numero_cuenta': row[11],
                    'titular_cuenta': row[12],
                    'telefono_contacto': row[13]
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
            # Asignamos marcadores de posición para los valores que se insertarán
            sql = """
                INSERT INTO Fundaciones (nit, nombre, direccion, telefono, email, persona_acargo, contrasena, foto_url, descripcion, banco, tipo_cuenta, numero_cuenta, titular_cuenta, telefono_contacto)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
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
                fundacion.get('descripcion', ''),
                fundacion.get('banco', None),
                fundacion.get('tipo_cuenta', None),
                fundacion.get('numero_cuenta', None),
                fundacion.get('titular_cuenta', None),
                fundacion.get('telefono_contacto', None)
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
            sql = "SELECT nit, nombre, direccion, telefono, email, persona_acargo, foto_url, descripcion, banco, tipo_cuenta, numero_cuenta, titular_cuenta, telefono_contacto FROM Fundaciones WHERE nit = %s"
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
                    'descripcion': row[7],
                    'banco': row[8],
                    'tipo_cuenta': row[9],
                    'numero_cuenta': row[10],
                    'titular_cuenta': row[11],
                    'telefono_contacto': row[12]
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
            
            # Lista de campos que se actualizarán
            update_fields = []
            # Lista de valores nuevos
            valores = []

            campos_permitidos = ['nombre', 'direccion', 'telefono', 'email', 'persona_acargo', 'foto_url', 'descripcion', 'banco', 'tipo_cuenta', 'numero_cuenta', 'titular_cuenta', 'telefono_contacto']
            for key in campos_permitidos:

                # Verifica si el campo existe y no es None
                if key in datos and datos[key] is not None:
                    # Agrega el campo y el valor a la lista de campos y valores
                    update_fields.append(f"{key} = %s")
                    # Agrega el valor a la lista de valores
                    valores.append(datos[key])

            # Verifica si no hay campos para actualizar
            if not update_fields:
                if 'contrasena' not in datos or not datos['contrasena']:
                    return True

            if update_fields:
                sql = f"UPDATE Fundaciones SET {', '.join(update_fields)} WHERE nit = %s"
                valores.append(nit)
                cursor.execute(sql, tuple(valores))

            # Actualiza la contraseña si se proporciona una nueva
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
            sql = "SELECT nit, nombre, direccion, telefono, email, persona_acargo, foto_url, descripcion, banco, tipo_cuenta, numero_cuenta, titular_cuenta, telefono_contacto FROM Fundaciones"
            cursor.execute(sql)
            # Recupera todas las filas de la consulta
            rows = cursor.fetchall()
            fundaciones = []
            # Recorre todas las filas de la consulta
            for row in rows:
                # Crea un diccionario con los valores de la fila guardados en fundaciones
                fundaciones.append({
                    'nit': row[0],
                    'nombre': row[1],
                    'direccion': row[2],
                    'telefono': row[3],
                    'email': row[4],
                    'persona_acargo': row[5],
                    'foto_url': row[6],
                    'descripcion': row[7],
                    'banco': row[8],
                    'tipo_cuenta': row[9],
                    'numero_cuenta': row[10],
                    'titular_cuenta': row[11],
                    'telefono_contacto': row[12]
                })
            return fundaciones
        except Exception as ex:
            print('Error al listar fundaciones:', ex)
            return []
from werkzeug.security import generate_password_hash

class Modelo_fundacion:
    @staticmethod
    def crear_fundacion(db, fundacion):
        cursor = db.connection.cursor()
        contrasena_hash = generate_password_hash(fundacion['contrasena'])
        sql = """
            INSERT INTO Fundaciones (nit, nombre, direccion, telefono, email, persona_acargo, contrasena, descripcion)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(sql, (
            fundacion['nit'],
            fundacion['nombre'],
            fundacion['direccion'],
            fundacion['telefono'],
            fundacion['email'],
            fundacion['persona_acargo'],
            contrasena_hash,
            fundacion.get('descripcion', '')
        ))
        db.connection.commit()
        return cursor.lastrowid  # Devuelve el id de la fundación creada
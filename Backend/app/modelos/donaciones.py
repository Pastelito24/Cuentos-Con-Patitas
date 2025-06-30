from datetime import date

class Donacion:
    @staticmethod
    def all(db):
        cur = db.connection.cursor()
        cur.execute('SELECT * FROM Donaciones ORDER BY fecha_donacion DESC')
        columns = [desc[0] for desc in cur.description]
        donaciones = [dict(zip(columns, row)) for row in cur.fetchall()]
        cur.close()
        return donaciones

    @staticmethod
    def create(db, data):
        cur = db.connection.cursor()
        cur.execute(
            '''INSERT INTO Donaciones
                (usuario_id, nombre_usuario, cedula_usuario, fundacion_id, Tipo_Donacion, fecha_donacion, Descripcion)
               VALUES (%s, %s, %s, %s, %s, %s, %s)''',
            (
                data['usuario_id'],
                data['nombre_usuario'],
                data['cedula_usuario'],
                data['fundacion_id'],
                data['Tipo_Donacion'],
                data.get('fecha_donacion', date.today()),
                data['Descripcion']
            )
        )
        db.connection.commit()
        cur.close()

    @staticmethod
    def by_fundacion(db, fundacion_id):
        cur = db.connection.cursor()
        cur.execute('SELECT * FROM Donaciones WHERE fundacion_id=%s ORDER BY fecha_donacion DESC', (fundacion_id,))
        columns = [desc[0] for desc in cur.description]
        donaciones = [dict(zip(columns, row)) for row in cur.fetchall()]
        cur.close()
        return donaciones

    @staticmethod
    def by_usuario(db, usuario_id):
        cur = db.connection.cursor()
        cur.execute('SELECT * FROM Donaciones WHERE usuario_id=%s ORDER BY fecha_donacion DESC', (usuario_id,))
        columns = [desc[0] for desc in cur.description]
        donaciones = [dict(zip(columns, row)) for row in cur.fetchall()]
        cur.close()
        return donaciones 
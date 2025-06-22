from app.modelo_fundacion import Modelo_fundacion

class Modelo_eventos:
    @staticmethod
    def crear_evento(db, evento, nit):
        try:
            cursor = db.connection.cursor()
            cursor.execute("SELECT fundacion_id, nombre FROM Fundaciones WHERE nit = %s", (nit,)) 
            fundacion = cursor.fetchone()
            if not fundacion:
                print("Fundación no encontrada.")
                return None
            
            fundacion_id = fundacion[0]
            nombrefundacion = fundacion[1]

            sql = """
                INSERT INTO eventos (fundacion_id, nombrefundacion, nombreEvento, nombrelugar, fecha, Descripcion, evento_imagen) 
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """

            cursor.execute(sql, (
                fundacion_id,
                nombrefundacion,
                evento['nombreEvento'],
                evento['nombrelugar'],
                evento['fecha'],
                evento['Descripcion'],
                evento.get('evento_imagen')
            ))

            db.connection.commit()
            return cursor.lastrowid
        except Exception as ex:
            db.connection.rollback()
            print('Error al crear el evento:', ex)
            return None
    
    # leer evento
    @staticmethod
    def obtener_evento(db, evento_id):
        try:
            cursor = db.connection.cursor()
            sql = "SELECT Id_evento, fundacion_id, nombreEvento, nombrelugar, fecha, Descripcion, evento_imagen FROM Eventos WHERE Id_evento = %s"
            cursor.execute(sql, (evento_id,))
            row = cursor.fetchone()

            if row is not None:
                return {
                    'Id_evento': row[0],
                    'fundacion_id': row[1],
                    'nombreEvento': row[2],
                    'nombrelugar': row[3],
                    'fecha_hora': row[4].strftime('%Y-%m-%dT%H:%M') if row[4] else None,
                    'Descripcion': row[5],
                    'evento_imagen': row[6]
                }
            else:
                return None
        except Exception as ex:
            print('Error al obtener el evento:', ex)
            return None

    # actualizar evento
    @staticmethod
    def actualizar_evento(db, evento_id, datos):
        try:
            cursor = db.connection.cursor()
            
            update_fields = []
            valores = []

            mapa_campos = {
                'nombreEvento': 'nombreEvento',
                'nombrelugar': 'nombrelugar',
                'fecha': 'fecha',
                'Descripcion': 'Descripcion',
                'evento_imagen': 'evento_imagen'
            }

            for key, column in mapa_campos.items():
                if key in datos:
                    update_fields.append(f"{column} = %s")
                    valores.append(datos[key])

            if not update_fields:
                return True

            sql = f"UPDATE Eventos SET {', '.join(update_fields)} WHERE Id_evento = %s"
            valores.append(evento_id)
            
            cursor.execute(sql, tuple(valores))
            db.connection.commit()
            return True
        except Exception as ex:
            db.connection.rollback()
            print('Error al actualizar el evento:', ex)
            return False
    
    #eliminar evento
    @staticmethod
    def eliminar_evento(db, evento_id):
        try:
            cursor = db.connection.cursor()
            sql = "DELETE FROM Eventos WHERE Id_evento = %s"
            cursor.execute(sql, (evento_id,))
            db.connection.commit()
            return True
        except Exception as ex:
            db.connection.rollback()
            print('Error al eliminar el evento:', ex)
            return False
        
    # listar eventos por fundacion
    @staticmethod
    def listar_eventos_por_fundacion(db, fundacion_id):
        try:
            cursor = db.connection.cursor()
            sql = "SELECT Id_evento, fundacion_id, nombreEvento, nombrelugar, fecha, Descripcion, evento_imagen FROM Eventos WHERE fundacion_id = %s"
            cursor.execute(sql, (fundacion_id,))
            rows = cursor.fetchall()
            eventos = []
            for row in rows:
                eventos.append({
                    'Id_evento': row[0],
                    'fundacion_id': row[1],
                    'nombreEvento': row[2],
                    'nombrelugar': row[3],
                    'fecha_hora': row[4].strftime('%Y-%m-%dT%H:%M') if row[4] else None,
                    'Descripcion': row[5],
                    'evento_imagen': row[6]
                })
            return eventos
        except Exception as ex:
            print('Error al listar los eventos por fundacion:', ex)
            return []

    # listar y buscar todos los eventos
    @staticmethod
    def listar_y_buscar_eventos(db, nombre=None):
        try:
            cursor = db.connection.cursor()
            sql = """
                SELECT e.Id_evento, f.nombre as nombre_fundacion, e.nombreEvento, e.nombrelugar, e.fecha, e.Descripcion, e.evento_imagen 
                FROM Eventos e
                JOIN Fundaciones f ON e.fundacion_id = f.fundacion_id
            """
            params = []
            if nombre and nombre.strip():
                sql += " WHERE e.nombreEvento LIKE %s"
                params.append(f'%{nombre}%')
            
            sql += " ORDER BY e.fecha DESC"
            
            cursor.execute(sql, tuple(params))
            rows = cursor.fetchall()
            eventos = []
            for row in rows:
                eventos.append({
                    'Id_evento': row[0],
                    'nombre_fundacion': row[1],
                    'nombreEvento': row[2],
                    'nombrelugar': row[3],
                    'fecha_hora': row[4].strftime('%Y-%m-%dT%H:%M') if row[4] else None,
                    'Descripcion': row[5],
                    'evento_imagen': row[6]
                })
            return eventos
        except Exception as ex:
            print('Error al listar o buscar eventos:', ex)
            return []
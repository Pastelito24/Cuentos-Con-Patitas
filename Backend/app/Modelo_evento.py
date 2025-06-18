class Evento ():
    @staticmethod
    def crear_Evento(db, Eventos):
        try:
            cursor = db.connection.cursor()
            sql = """
            INSERT INTO Eventos (nombreEvento, nombreLugar, fecha, hora, descripcion)
            VALUES (%s, %s, %s, %s, %s)
            """
            cursor.execute(sql, (
                
                Eventos['nombreEvento'],
                Eventos['nombreLugar'],
                Eventos['fecha'],
                Eventos['hora'],
                Eventos['descripcion']
            ))
            db.connection.commit()
            return True
        except Exception as ex:
            print('Error al crear el Evento', ex)
            return False

    # leer Evento
    @staticmethod
    def obtener_Evento(db, fundacion_id):
        try:
            cursor = db.connection.cursor()
            sql = "SELECT nombreEvento,nombreLugar,fecha,hora,descripcion FROM Eventos WHERE fundacion_id = %s"
            cursor.execute(sql, (fundacion_id,))
            row =  cursor.fetchone()
            
            if row is not None:
                return {
                    'nombreEvento': row[0],
                    'nombreLugar': row[1],
                    'fecha': row[2],
                    'hora': row[3],
                    'descripcion': row[4]
                }
            return None
        except Exception as ex:
            print('Error al obtener el Evento:', ex)
            return None
        
    # actualizar Evento
    @staticmethod
    def actualizar_Evento(db, fundacion_id,datos):
        try:
            cursor = db.connection.cursor()
            sql = """
                UPDATE Eventos
                SET nombreEvento = %s, nombreLugar = %s, fecha = %s, 
                    hora = %s, descripcion = %s
                WHERE fundacion_id = %s
            """
            cursor.execute(sql, (
                datos['nombreEvento'],
                datos['nombreLugar'],
                datos['fecha'],
                datos['hora'],
                datos['descripcion'],
                fundacion_id
            
            ))
            db.connection.commit()
            return True
        except Exception as ex:
            print('Error al actualizar el Evento:', ex)
            return False
        
    # eliminar Evento
    @staticmethod
    def eliminar_Evento(db, fundacion_id):
        try:
            cursor = db.connection.cursor()
            sql = "DELETE FROM Eventos WHERE fundacion_id = %s"
            cursor.execute(sql, (fundacion_id,))
            db.connection.commit()
            return True
        except Exception as ex:
            print('Error al eliminar el evento:', ex)
            return False
        
    # listar Eventos
    @staticmethod
    def listar_Eventos(db):
        try:
            cursor = db.connection.cursor()
            sql = "SELECT nombreEvento,nombreLugar,fecha,hora,descripcion FROM Eventos"
            cursor.execute(sql)
            rows = cursor.fetchall()
            Eventos = []
            for row in rows:
                Eventos.append({
                    'nombreEvento': row[0],
                    'nombreLugar': row[1],
                    'fecha': row[2],
                    'hora': row[3],
                    'descripcion': row[4]
                })
            return Eventos
        except Exception as ex:
            print('Error al listar los Eventos:', ex)
            return []
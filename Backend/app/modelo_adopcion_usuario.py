import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def registrar_adopcion(db, datos):
    """
    Registra una adopción en la base de datos.
    datos: {
        'usuario_id': ... (cedula),
        'animal_id': ...,
        'fundacion_id': ...,
        'fecha': ...,
    }
    """
    try:
        cursor = db.connection.cursor()
        # Buscar usuario_id real a partir de la cédula
        cursor.execute("SELECT usuario_id, nombre, cedula FROM usuarios WHERE cedula = %s", (datos['usuario_id'],))
        usuario = cursor.fetchone()
        if not usuario:
            return False, "Usuario no encontrado"
        usuario_id_real = usuario[0]
        nombre_adoptante = usuario[1]
        cedula_adoptante = usuario[2]
        # Obtener el estado de disponibilidad del animal
        cursor.execute("SELECT disponibilidad FROM animales WHERE animal_id = %s", (datos['animal_id'],))
        animal = cursor.fetchone()
        if not animal:
            return False, "Animal no encontrado"
        disponibilidad = animal[0]
        # estado_adopcion = "Disponible" if disponibilidad else "No Disponible"
        # Siempre registrar la adopción con estado 'en proceso' según la nueva lógica de negocio
        # Esto permite que la fundación gestione el cambio a 'adoptado' o 'no adoptado' posteriormente
        estado_adopcion = "en proceso"
        # Insertar la adopción
        sql = """
            INSERT INTO adopciones (animal_id, usuario_id, nombre_adoptante, cedula_adoptante, fecha_adopcion, estado_adopcion)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.execute(sql, (
            datos['animal_id'],
            usuario_id_real,
            nombre_adoptante,
            cedula_adoptante,
            datos['fecha'],
            estado_adopcion
        ))
        db.connection.commit()
        # Si el animal estaba disponible, actualizar su disponibilidad y el estado de adopciones
        if disponibilidad:
            # Cambiar disponibilidad del animal a No Disponible
            cursor.execute("UPDATE animales SET disponibilidad = 0 WHERE animal_id = %s", (datos['animal_id'],))
            # Cambiar estado_adopcion de todas las adopciones de ese animal a 'No Disponible'
            # cursor.execute("UPDATE adopciones SET estado_adopcion = 'en proceso' WHERE animal_id = %s", (datos['animal_id'],))

            db.connection.commit()
        return True, "Registro de adopción exitoso"
    except Exception as ex:
        print('Error al registrar adopción:', ex)
        return False, str(ex)

def enviar_correo_adopcion(db, datos):
    """
    datos: {
        'usuario_id': ...,
        'animal_id': ...,
        'fundacion_id': ...,
        'fecha': ...,
    }
    """
    # 1. Obtener datos del usuario
    cursor = db.connection.cursor()
    cursor.execute("SELECT nombre, cedula, email FROM usuarios WHERE cedula = %s", (datos['usuario_id'],))
    usuario = cursor.fetchone()
    if not usuario:
        return False, "Usuario no encontrado"

    # 2. Obtener datos del animal
    cursor.execute("SELECT nombre, tipo_animal, raza, edad, descripcion FROM animales WHERE animal_id = %s", (datos['animal_id'],))
    animal = cursor.fetchone()
    if not animal:
        return False, "Animal no encontrado"

    # 3. Obtener email de la fundación
    cursor.execute("SELECT nombre, email FROM fundaciones WHERE fundacion_id = %s", (datos['fundacion_id'],))
    fundacion = cursor.fetchone()
    if not fundacion:
        return False, "Fundación no encontrada"

    # 4. Preparar el correo
    asunto = f"Solicitud de adopción para {animal[0]}"
    cuerpo = f"""
    <html>
    <head>
      <link href='https://fonts.googleapis.com/css?family=Fredoka+One&display=swap' rel='stylesheet'>
      <style>
        body {{
          background-image: url("https://raw.githubusercontent.com/Pastelito24/Cuentos-Con-Patitas/main/Backend/static/fundaciones/85214963_fundacion.jpg");
          background-size: cover;
          font-family: 'Fredoka One', 'Comic Sans MS', 'Arial Rounded MT Bold', Arial, sans-serif;
          color: #5a3c1a;
          padding: 0;
          margin: 0;
          min-height: 100vh;
        }}
        .card {{
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 2px 12px rgba(90,60,26,0.08);
          padding: 32px 28px;
          max-width: 600px;
          margin: 40px auto;
        }}
        .titulo {{
          font-size: 2rem;
          color: #ff914d;
          font-family: 'Fredoka One', 'Comic Sans MS', cursive, sans-serif;
          margin-bottom: 18px;
          text-align: center;
        }}
        .dato, .footer {{
          font-size: 1.1rem;
          margin-bottom: 12px;
        }}
        .dato strong {{
          color: #ff914d;
        }}
        .footer {{
          margin-top: 28px;
          font-size: 1rem;
          color: #a67c52;
          text-align: center;
        }}
        a {{
          color: #ff914d;
          text-decoration: none;
        }}
        .animal-info {{
          background: #fff6e9;
          border-radius: 12px;
          padding: 14px 18px;
          margin: 18px 0;
          font-size: 0.8rem;
        }}
      </style>
    </head>
    <body>
      <div class="card">
        <div class="titulo">Solicitud de adopción para {animal[0]}</div>
        <div class="dato"><b>Hola {fundacion[0]},</b></div>
        <div class="dato">
          El usuari@ <strong>{usuario[0]}</strong> con número de cédula <strong>{usuario[1]}</strong> y email <a href=\"mailto:{usuario[2]}\">{usuario[2]}</a> ha solicitado adoptar a:
        </div>
        <div class="animal-info">
          <b>Al pequeñ@ {animal[1]}</b> de nombre <b>{animal[0]},</b> raza <b>{animal[2]}</b> y edad <b>{animal[3]} años</b>.<br><br>
          <b>Personalidad del pequeñ@ {animal[0]}: </b>
          <i>{animal[4]}</i>
        </div>
        <div class="dato">
          <b>Fecha de solicitud:</b> {str(datos['fecha'])[:10]}
        </div>
        <div class="footer">
          Por favor, póngase en contacto con el usuario para continuar el proceso.<br>
          <i>🐾 Gracias por usar Cuentos Con Patitas 🐾</i>
        </div>
      </div>
    </body>
    </html>
    """

    # 5. Enviar el correo (ajusta los datos SMTP a los de tu servidor/correo)
    remitente = "pruebaregistroadopciones1234@gmail.com"  # <-- Cambiar a correo del servidor
    password = "clfp fhtx ckfk fhos"        # <-- Cambiar a contraseña del servidor
    destinatario = fundacion[1]

    msg = MIMEMultipart()
    msg['From'] = remitente
    msg['To'] = destinatario
    msg['Subject'] = asunto
    msg.attach(MIMEText(cuerpo, 'html'))

    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(remitente, password)
        server.sendmail(remitente, destinatario, msg.as_string())
        server.quit()
        return True, "Correo enviado correctamente"
    except Exception as e:
        return False, str(e)

# listar adopciones por fundación
def listar_adopciones_por_fundacion(db, fundacion_id):
    """
    Retorna una lista de adopciones asociadas a una fundación específica.
    """
    try:
        cursor = db.connection.cursor()
        sql = """
            SELECT 
                a.adopcion_id,
                a.animal_id,
                an.nombre AS animal_nombre,
                an.fotoanimal_url,
                a.usuario_id,
                u.nombre AS usuario_nombre,
                a.nombre_adoptante,
                a.cedula_adoptante,
                a.fecha_adopcion,
                a.estado_adopcion
            FROM adopciones a
            LEFT JOIN animales an ON a.animal_id = an.animal_id
            LEFT JOIN usuarios u ON a.usuario_id = u.usuario_id
            WHERE an.fundacion_id = %s
            ORDER BY a.fecha_adopcion DESC
        """
        cursor.execute(sql, (fundacion_id,))
        rows = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description]
        # retornar fecha hora y dia
        #return [dict(zip(columns, row)) for row in rows]
        adopciones = []
        for row in rows:
            adopcion = dict(zip(columns, row))
            # Formatear la fecha para que solo muestre YYYY-MM-DD
            if adopcion.get('fecha_adopcion'):
                adopcion['fecha_adopcion'] = str(adopcion['fecha_adopcion'])[:10]
            adopciones.append(adopcion)
        return adopciones
    except Exception as ex:
        print('Error al listar adopciones por fundación:', ex)
        return []

def actualizar_estado_adopcion(db, adopcion_id, nuevo_estado):
    """
    Permite a la fundación actualizar el estado de una adopción específica (por adopcion_id).
    Si el estado es 'adoptado', la disponibilidad del animal permanece en 0.
    Si el estado es 'no adoptado', la disponibilidad del animal vuelve a 1 SOLO si no hay otra adopción en proceso para ese animal.
    """
    try:
        cursor = db.connection.cursor()
        # Obtener el animal_id asociado a la adopción
        cursor.execute("SELECT animal_id FROM adopciones WHERE adopcion_id = %s", (adopcion_id,))
        result = cursor.fetchone()
        if not result:
            return False, "Adopción no encontrada"
        animal_id = result[0]
        # Actualizar el estado de esta adopción
        cursor.execute("UPDATE adopciones SET estado_adopcion = %s WHERE adopcion_id = %s", (nuevo_estado, adopcion_id))
        # Si es 'no adoptado', solo poner disponible si NO hay otra adopción en proceso para ese animal
        if nuevo_estado == 'no adoptado':
            cursor.execute("SELECT COUNT(*) FROM adopciones WHERE animal_id = %s AND estado_adopcion = 'en proceso'", (animal_id,))
            en_proceso = cursor.fetchone()[0]
            if en_proceso == 0:
                cursor.execute("UPDATE animales SET disponibilidad = 1 WHERE animal_id = %s", (animal_id,))
        # Si es 'adoptado', asegurarse que el animal siga como no disponible
        elif nuevo_estado == 'adoptado':
            cursor.execute("UPDATE animales SET disponibilidad = 0 WHERE animal_id = %s", (animal_id,))
        db.connection.commit()
        return True, "Estado de adopción actualizado correctamente"
    except Exception as ex:
        print('Error al actualizar estado de adopción:', ex)
        return False, str(ex)

def obtener_adopcion_en_proceso_o_reciente(db, animal_id):
    """
    Retorna la adopción en proceso (o la más reciente) para un animal dado su animal_id.
    """
    try:
        cursor = db.connection.cursor()
        # Buscar adopción en proceso primero
        cursor.execute("SELECT adopcion_id, estado_adopcion FROM adopciones WHERE animal_id = %s AND estado_adopcion = 'en proceso' ORDER BY fecha_adopcion DESC LIMIT 1", (animal_id,))
        adopcion = cursor.fetchone()
        if adopcion:
            return {'adopcion_id': adopcion[0], 'estado_adopcion': adopcion[1]}
        # Si no hay en proceso, buscar la más reciente
        cursor.execute("SELECT adopcion_id, estado_adopcion FROM adopciones WHERE animal_id = %s ORDER BY fecha_adopcion DESC LIMIT 1", (animal_id,))
        adopcion = cursor.fetchone()
        if adopcion:
            return {'adopcion_id': adopcion[0], 'estado_adopcion': adopcion[1]}
        return None
    except Exception as ex:
        print('Error al obtener adopción en proceso o reciente:', ex)
        return None
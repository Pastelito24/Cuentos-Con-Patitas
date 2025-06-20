@app.route('/api/editar_descripcion_fundacion', methods=['POST'])
def editar_descripcion_fundacion():
    if not hasattr(current_user, 'nit'):
        return jsonify({'success': False, 'error': 'No autorizado'}), 403
    
    data = request.get_json()
    if 'descripcion' not in data:
        return jsonify({'success': False, 'error': 'Falta la descripción'}), 400
    
    try:
        cursor = db.connection.cursor()
        cursor.execute(
            "UPDATE Fundaciones SET descripcion = %s WHERE nit = %s",
            (data['descripcion'], current_user.nit)
        )
        db.connection.commit()
        return jsonify({'success': True, 'message': 'Descripción actualizada correctamente'})
    except Exception as e:
        return jsonify({'success': False, 'error': 'Error al actualizar la descripción'}), 500

@app.route('/api/agregar_animal', methods=['POST'])
def agregar_animal():
    if not hasattr(current_user, 'nit'):
        return jsonify({'success': False, 'error': 'No autorizado'}), 403
    
    try:
        data = request.get_json()
        cursor = db.connection.cursor()

        cursor.execute("SELECT fundacion_id FROM Fundaciones WHERE nit = %s", (current_user.nit,))
        fundacion = cursor.fetchone()
        if not fundacion:
            return jsonify({'success': False, 'error': 'Fundación no encontrada'}), 404
        fundacion_id = fundacion[0]

        # Validar campos
        required_fields = ['nombre', 'tipo_animal', 'genero', 'edad', 'peso']
        if not all(field in data and str(data[field]).strip() for field in required_fields):
            return jsonify({'success': False, 'error': 'Faltan campos requeridos'}), 400
        
        sql = """
            INSERT INTO animales (
                fundacion_id, nombre, tipo_animal, edad, peso, 
                condicion, descripcion, fotoanimal_url, fecha_ingreso, 
                disponibilidad, genero, raza
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, CURRENT_DATE, %s, %s, %s)
        """
        cursor.execute(sql, (
            fundacion_id,
            data['nombre'],
            data['tipo_animal'].lower(),
            int(data['edad']),
            float(data['peso']),
            data.get('condicion', ''),
            data.get('descripcion', ''),
            data.get('fotoanimal_url'), 
            data.get('disponibilidad', True),
            data['genero'].lower(),
            data.get('raza', '')
        ))
        db.connection.commit()
        animal_id = cursor.lastrowid

        # Devolver el animal recién creado
        cursor.execute("""
            SELECT 
                animal_id, fundacion_id, nombre, tipo_animal, genero, raza, edad, peso,
                condicion, descripcion, CAST(disponibilidad AS UNSIGNED) AS disponibilidad,
                fecha_ingreso, fotoanimal_url
            FROM animales WHERE animal_id = %s
        """, (animal_id,))
        
        nuevo_animal = cursor.fetchone()
        if nuevo_animal:
            columns = [desc[0] for desc in cursor.description]
            animal_dict = convert_to_dict(nuevo_animal, columns)
            return jsonify({'success': True, 'animal': animal_dict, 'message': 'Animalito agregado con éxito'})
        else:
            return jsonify({'success': False, 'error': 'No se pudo recuperar el animal agregado'}), 500

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
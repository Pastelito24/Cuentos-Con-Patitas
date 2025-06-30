from app.entidades.usuario import Usuario
from werkzeug.security import generate_password_hash, check_password_hash
import os
from flask import current_app

class Modelo_usuario():
    # login usuario
    @classmethod
    def comprobar_user(self, db, user):
        try:
            cursor = db.connection.cursor()
            sql = "SELECT usuario_id, cedula, contrasena, rol, nombre, telefono, email, direccion, edad, fundacion_id, usuariofoto_url FROM usuarios WHERE cedula = %s"
            cursor.execute(sql, (user.cedula,))
            row = cursor.fetchone()
            print("Consulta SQL:", sql, "Valor:", user.cedula)
            print("Resultado de la consulta:", row)
            if row is not None:
                print("Contraseña ingresada:", user.contrasena)
                print("Contraseña en BD:", row[2])
                if check_password_hash(row[2], user.contrasena):
                    print("Contraseña válida")
                    return Usuario(
                        usuario_id=row[0],
                        cedula=row[1],
                        contrasena=row[2],
                        rol=row[3],
                        nombre=row[4],
                        telefono=row[5],
                        email=row[6],
                        direccion=row[7],
                        edad=row[8],
                        fundacion_id=row[9],
                        usuariofoto_url=row[10]
                    )
                else:
                    print("Contraseña inválida")
                    return None
            else:
                print("Usuario no encontrado")
                return None
        except Exception as ex:
            raise Exception(ex)
    # registrar usuario
    @classmethod
    def crear_usuario(cls, db, user):
        try:
            cursor = db.connection.cursor()
            sql = """
                INSERT INTO usuarios (cedula, contrasena, rol, nombre, telefono, email, direccion, edad, fecha_registro, fundacion_id, usuariofoto_url)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, NOW(), %s, %s)
            """
            contrasena_hash = generate_password_hash(user.contrasena)
            valores = (
                user.cedula,
                contrasena_hash,
                user.rol,
                user.nombre,
                user.telefono,
                user.email,
                user.direccion,
                user.edad,
                user.fundacion_id,
                user.usuariofoto_url
            )
            cursor.execute(sql, valores)
            db.connection.commit()
            return True
        except Exception as ex:
            print('Error al crear usuario:', ex)
            return False
    # leer usuario 
    @classmethod
    def obtener_usuario(cls, db, cedula):
        try:
            cursor = db.connection.cursor()
            sql = "SELECT usuario_id, cedula, contrasena, rol, nombre, telefono, email, direccion, edad, fundacion_id, usuariofoto_url FROM usuarios WHERE cedula = %s"
            cursor.execute(sql, (cedula,))
            row = cursor.fetchone()
            if row is not None:
                return Usuario(
                    usuario_id=row[0],
                    cedula=row[1],
                    contrasena=row[2],
                    rol=row[3],
                    nombre=row[4],
                    telefono=row[5],
                    email=row[6],
                    direccion=row[7],
                    edad=row[8],
                    fundacion_id=row[9],
                    usuariofoto_url=row[10]
                )
            return None
        except Exception as ex:
            print('Error al obtener usuario:', ex)
            return None
    # actualizar usuario
    @classmethod
    def actualizar_usuario(cls, db, cedula, datos):
        try:
            cursor = db.connection.cursor()
            
            update_fields = []
            valores = []

            for key in ['nombre', 'telefono', 'email', 'direccion', 'edad', 'usuariofoto_url']:
                if key in datos and datos[key] is not None:
                    update_fields.append(f"{key} = %s")
                    valores.append(datos[key])

            if not update_fields: # No hay campos para actualizar
                if 'contrasena' not in datos or not datos['contrasena']:
                     return True # No hay nada que hacer

            if update_fields:
                sql = f"UPDATE usuarios SET {', '.join(update_fields)} WHERE cedula = %s"
                valores.append(cedula)
                cursor.execute(sql, tuple(valores))

            if 'contrasena' in datos and datos['contrasena']:
                contrasena_hash = generate_password_hash(datos['contrasena'])
                cursor.execute("UPDATE usuarios SET contrasena = %s WHERE cedula = %s", (contrasena_hash, cedula))
            
            db.connection.commit()
            return True
        except Exception as ex:
            print('Error al actualizar usuario:', ex)
            db.connection.rollback()
            return False
            
    # eliminar usuario
    @classmethod
    def eliminar_usuario(cls, db, cedula):
        try:
            cursor = db.connection.cursor()

            # Primero, obtener la URL de la foto para borrar el archivo
            cursor.execute("SELECT usuariofoto_url FROM usuarios WHERE cedula = %s", (cedula,))
            result = cursor.fetchone()
            if result and result[0]:
                try:
                    # Construir la ruta absoluta al archivo
                    # La URL es como /static/usuarios/foto.jpg
                    # Se necesita quitar el / para que os.path.join funcione correctamente desde la raíz del proyecto
                    relative_path = result[0].lstrip('/')
                    foto_path = os.path.join(current_app.root_path, '..', relative_path)
                    
                    if os.path.exists(foto_path):
                        os.remove(foto_path)
                        print(f"Foto de usuario eliminada: {foto_path}")
                except Exception as e:
                    print(f"Error al eliminar archivo de foto de usuario: {e}")

            # Luego, eliminar el registro del usuario
            sql = "DELETE FROM usuarios WHERE cedula = %s"
            cursor.execute(sql, (cedula,))
            db.connection.commit()
            return True
        except Exception as ex:
            print('Error al eliminar usuario:', ex)
            db.connection.rollback()
            return False

    # listar usuarios
    @classmethod
    def listar_usuarios(cls, db):
        try:
            cursor = db.connection.cursor()
            sql = "SELECT usuario_id, cedula, contrasena, rol, nombre, telefono, email, direccion, edad, fundacion_id, usuariofoto_url FROM usuarios"
            cursor.execute(sql)
            rows = cursor.fetchall()
            usuarios = []
            for row in rows:
                usuarios.append({
                    'usuario_id': row[0],
                    'cedula': row[1],
                    'nombre': row[4],
                    'telefono': row[5],
                    'email': row[6],
                    'direccion': row[7],
                    'edad': row[8],
                    'usuariofoto_url': row[10]
                })
            return usuarios
        except Exception as ex:
            print('Error al listar usuarios:', ex)
            return []
import MySQLdb
from app.configuracion import configu
import traceback

def check_image_urls():
    try:
        print("Iniciando verificación de URLs...")
        
        # Conectar a la base de datos usando el mismo conector que el backend
        conn = MySQLdb.connect(
            host=configu['desarrolloConfig'].MYSQL_HOST,
            user=configu['desarrolloConfig'].MYSQL_USER,
            passwd=configu['desarrolloConfig'].MYSQL_PASSWORD,
            db=configu['desarrolloConfig'].MYSQL_DB,
            port=configu['desarrolloConfig'].MYSQL_PORT
        )
        
        print("Conexión exitosa a la base de datos")
        cursor = conn.cursor()
        
        print("=== VERIFICACIÓN DE URLs DE IMÁGENES ===\n")
        
        # Verificar fundaciones
        print("1. FUNDACIONES:")
        cursor.execute("SELECT nit, fundacion_id, nombre, foto_url FROM Fundaciones")
        fundaciones = cursor.fetchall()
        print(f"   Encontradas {len(fundaciones)} fundaciones")
        
        for fundacion in fundaciones:
            nit, fundacion_id, nombre, foto_url = fundacion
            print(f"   NIT: {nit}")
            print(f"   Fundacion ID: {fundacion_id}")
            print(f"   Nombre: {nombre}")
            print(f"   Foto URL: {foto_url}")
            print()
        
        # Verificar animales
        print("2. ANIMALES:")
        cursor.execute("""
            SELECT a.animal_id, a.fundacion_id, a.nombre, a.fotoanimal_url,
                   f.nit, f.nombre as nombre_fundacion
            FROM animales a
            LEFT JOIN Fundaciones f ON a.fundacion_id = f.fundacion_id
            ORDER BY a.fundacion_id, a.animal_id
        """)
        animales = cursor.fetchall()
        print(f"   Encontrados {len(animales)} animales")
        
        for animal in animales:
            animal_id, fundacion_id, nombre, fotoanimal_url, nit, nombre_fundacion = animal
            print(f"   Animal ID: {animal_id}")
            print(f"   Fundacion ID: {fundacion_id}")
            print(f"   Nombre: {nombre}")
            print(f"   NIT Fundación: {nit}")
            print(f"   Nombre Fundación: {nombre_fundacion}")
            print(f"   Foto URL: {fotoanimal_url}")
            print()
        
        # Verificar archivos físicos
        print("3. ARCHIVOS FÍSICOS:")
        import os
        animales_folder = os.path.join(os.path.dirname(__file__), 'static', 'animales')
        fundaciones_folder = os.path.join(os.path.dirname(__file__), 'static', 'fundaciones')
        
        print("   Archivos en /static/animales:")
        if os.path.exists(animales_folder):
            files = os.listdir(animales_folder)
            print(f"     Encontrados {len(files)} archivos")
            for file in files:
                file_path = os.path.join(animales_folder, file)
                file_size = os.path.getsize(file_path)
                print(f"     {file} ({file_size} bytes)")
        else:
            print("     Carpeta no existe")
        
        print("\n   Archivos en /static/fundaciones:")
        if os.path.exists(fundaciones_folder):
            files = os.listdir(fundaciones_folder)
            print(f"     Encontrados {len(files)} archivos")
            for file in files:
                file_path = os.path.join(fundaciones_folder, file)
                file_size = os.path.getsize(file_path)
                print(f"     {file} ({file_size} bytes)")
        else:
            print("     Carpeta no existe")
        
        conn.close()
        print("\nVerificación completada.")
        
    except Exception as e:
        print(f"Error: {e}")
        traceback.print_exc()

if __name__ == "__main__":
    check_image_urls() 
import MySQLdb

def test_simple_connection():
    print("=== PRUEBA DE CONEXIÓN SIMPLE ===")
    
    # Configuración
    host = 'localhost'
    user = 'root'
    password = '1234'
    database = 'bd_cuentosconpatitas'
    port = 3307
    
    print(f"Intentando conectar a:")
    print(f"Host: {host}")
    print(f"User: {user}")
    print(f"Password: {password}")
    print(f"Database: {database}")
    print(f"Port: {port}")
    
    try:
        # Prueba 1: Conexión sin base de datos
        print("\n--- Prueba 1: Conexión sin base de datos ---")
        connection = MySQLdb.connect(
            host=host,
            user=user,
            passwd=password,
            port=port
        )
        print("✅ Conexión exitosa sin base de datos")
        
        # Verificar bases de datos disponibles
        cursor = connection.cursor()
        cursor.execute("SHOW DATABASES")
        databases = [db[0] for db in cursor.fetchall()]
        print(f"Bases de datos disponibles: {databases}")
        
        if database in databases:
            print(f"✅ Base de datos '{database}' existe")
            
            # Prueba 2: Conexión con base de datos específica
            print("\n--- Prueba 2: Conexión con base de datos específica ---")
            connection.select_db(database)
            print(f"✅ Conexión exitosa a '{database}'")
            
            # Verificar tablas
            cursor.execute("SHOW TABLES")
            tables = [table[0] for table in cursor.fetchall()]
            print(f"Tablas encontradas: {tables}")
            
        else:
            print(f"❌ Base de datos '{database}' NO existe")
            
        connection.close()
        
    except MySQLdb.Error as e:
        print(f"❌ Error de conexión: {e}")
        print(f"Código de error: {e.args[0]}")
        print(f"Mensaje: {e.args[1]}")
        
        # Sugerencias según el código de error
        if e.args[0] == 1045:
            print("\n💡 SUGERENCIAS para error 1045:")
            print("1. Verifica que la contraseña sea correcta")
            print("2. Verifica que el usuario 'root' tenga permisos")
            print("3. Intenta cambiar la contraseña de root:")
            print("   ALTER USER 'root'@'localhost' IDENTIFIED BY '1234';")
            print("   FLUSH PRIVILEGES;")
        elif e.args[0] == 2003:
            print("\n💡 SUGERENCIAS para error 2003:")
            print("1. Verifica que MySQL esté ejecutándose")
            print("2. Verifica que el puerto sea correcto")
            print("3. Verifica que el host sea correcto")

if __name__ == "__main__":
    test_simple_connection() 
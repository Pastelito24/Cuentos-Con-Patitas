import MySQLdb
from app.configuracion import configu

def test_mysql_connection():
    conf = configu['desarrolloConfig']
    
    print(f"Intentando conectar a MySQL con:")
    print(f"Host: {conf.MYSQL_HOST}")
    print(f"User: {conf.MYSQL_USER}")
    print(f"Password: {conf.MYSQL_PASSWORD}")
    print(f"Database: {conf.MYSQL_DB}")
    print(f"Port: {conf.MYSQL_PORT}")
    
    try:
        # Intentar conexión sin especificar base de datos
        connection = MySQLdb.connect(
            host=conf.MYSQL_HOST,
            user=conf.MYSQL_USER,
            passwd=conf.MYSQL_PASSWORD,
            port=conf.MYSQL_PORT
        )
        print("✅ Conexión exitosa sin especificar base de datos")
        
        # Verificar si la base de datos existe
        cursor = connection.cursor()
        cursor.execute("SHOW DATABASES")
        databases = [db[0] for db in cursor.fetchall()]
        
        if conf.MYSQL_DB in databases:
            print(f"✅ Base de datos '{conf.MYSQL_DB}' existe")
            
            # Intentar conectar a la base de datos específica
            connection.select_db(conf.MYSQL_DB)
            print(f"✅ Conexión exitosa a la base de datos '{conf.MYSQL_DB}'")
            
            # Verificar tablas
            cursor.execute("SHOW TABLES")
            tables = [table[0] for table in cursor.fetchall()]
            print(f"Tablas encontradas: {tables}")
            
        else:
            print(f"❌ Base de datos '{conf.MYSQL_DB}' no existe")
            print(f"Bases de datos disponibles: {databases}")
            
        connection.close()
        
    except MySQLdb.Error as e:
        print(f"❌ Error de conexión: {e}")
        print(f"Código de error: {e.args[0]}")
        print(f"Mensaje: {e.args[1]}")

if __name__ == "__main__":
    test_mysql_connection() 
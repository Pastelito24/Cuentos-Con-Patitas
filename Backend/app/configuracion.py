import MySQLdb

class Configu_llave_secreta():
    llave_secreta = 'cerrado123456'

class ConfiDesarrollo(Configu_llave_secreta):
    DEBUG = True
    MYSQL_HOST = 'localhost'
    MYSQL_USER = 'root'
    MYSQL_PASSWORD = '1234'
    MYSQL_DB = 'bd_cuentosconpatitas'
    MYSQL_PORT = 3307


configu = {'desarrolloConfig': ConfiDesarrollo}

def get_db_connection():
    conf = configu['desarrolloConfig']
    return MySQLdb.connect(
        host=conf.MYSQL_HOST,
        user=conf.MYSQL_USER,
        passwd=conf.MYSQL_PASSWORD,
        db=conf.MYSQL_DB,
        port=conf.MYSQL_PORT
    )
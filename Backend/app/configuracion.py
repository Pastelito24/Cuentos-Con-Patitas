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
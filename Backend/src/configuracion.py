class Configu_llave_secreta():
    llave_secreta = 'cerrado123456'

class ConfiDesarrollo(Configu_llave_secreta):
    DEBUG = True
    MYSQL_HOST = 'localhost'
    MYSQL_USER = 'Lenovo'
    MYSQL_PASSWORD = 'admin'
    MYSQL_DB = 'bd_cuentosconpatitas'


configu = {'desarrolloConfig': ConfiDesarrollo}
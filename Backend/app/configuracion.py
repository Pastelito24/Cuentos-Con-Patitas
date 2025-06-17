class Configu_llave_secreta():
    llave_secreta = 'cerrado123456'

class ConfiDesarrollo(Configu_llave_secreta):
    DEBUG = True
    MYSQL_HOST = 'localhost'
    MYSQL_USER = 'root'
    MYSQL_PASSWORD = ''
    MYSQL_DB = 'bd_cuentosconpatitas'



configu = {'desarrolloConfig': ConfiDesarrollo}
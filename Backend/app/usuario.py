from werkzeug.security import check_password_hash


class Usuario():
    def __init__(self, cedula, contrasena):
        self.cedula = cedula
        self.contrasena = contrasena
        

    @classmethod
    def check_password(self, contrasena_guardada, contrasena_ingresada):
        return check_password_hash(contrasena_guardada, contrasena_ingresada)


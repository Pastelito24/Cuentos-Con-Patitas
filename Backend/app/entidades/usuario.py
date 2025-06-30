from flask_login import UserMixin

class Usuario(UserMixin):
    def __init__(self, cedula, contrasena, rol=None, nombre=None, telefono=None, email=None, direccion=None, edad=None, fundacion_id=None, usuariofoto_url=None, usuario_id=None):
        self.usuario_id = usuario_id
        self.cedula = cedula
        self.contrasena = contrasena
        self.rol = rol
        self.nombre = nombre
        self.telefono = telefono
        self.email = email
        self.direccion = direccion
        self.edad = edad
        self.fundacion_id = fundacion_id
        self.usuariofoto_url = usuariofoto_url

    # Ejemplo de uso:
    # user = Usuario(cedula='123456', contrasena='abc', rol='usuario', nombre='Juan', telefono='123', email='a@b.com', direccion='Calle 1', edad=20)

    def get_id(self):
        return str(self.cedula)

    @property
    def is_authenticated(self):
        return True

    @property
    def is_active(self):
        return True

    @property
    def is_anonymous(self):
        return False 
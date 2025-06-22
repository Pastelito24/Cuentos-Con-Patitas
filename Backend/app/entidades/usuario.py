class Usuario:
    def __init__(self, cedula, contrasena, rol=None, nombre=None, telefono=None, email=None, direccion=None, edad=None, fundacion_id=None, usuariofoto_url=None):
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

    def get_id(self):
        return self.cedula

    @property
    def is_authenticated(self):
        return True

    @property
    def is_active(self):
        return True

    @property
    def is_anonymous(self):
        return False 
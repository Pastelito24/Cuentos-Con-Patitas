class Usuario:
    def __init__(self, cedula, contrasena, rol=None, nombre=None, telefono=None, email=None, direccion=None, edad=None, fundacion_id=None):
        self.cedula = cedula
        self.contrasena = contrasena
        self.rol = rol
        self.nombre = nombre
        self.telefono = telefono
        self.email = email
        self.direccion = direccion
        self.edad = edad
        self.fundacion_id = fundacion_id 
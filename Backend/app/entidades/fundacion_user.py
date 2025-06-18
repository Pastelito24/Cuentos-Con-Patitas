class FundacionUser:
    def __init__(self, nit, nombre, email):
        self.nit = nit
        self.nombre = nombre
        self.email = email
        self.rol = 'fundacion'

    def get_id(self):
        return self.nit

    @property
    def is_authenticated(self):
        return True

    @property
    def is_active(self):
        return True

    @property
    def is_anonymous(self):
        return False 
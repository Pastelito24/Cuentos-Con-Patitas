from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SelectField, TextAreaField, SubmitField
from wtforms.validators import DataRequired

class DonacionForm(FlaskForm):
    nombre_usuario = StringField('Nombre', validators=[DataRequired()])
    cedula_usuario = IntegerField('Cédula', validators=[DataRequired()])
    Tipo_Donacion = SelectField('Tipo de Donación', choices=[
        ('Monetario', 'Monetario'),
        ('Alimentos', 'Alimentos'),
        ('Medicina', 'Medicina'),
        ('Otros', 'Otros')
    ], validators=[DataRequired()])
    Descripcion = TextAreaField('Descripción', validators=[DataRequired()])
    submit = SubmitField('Donar') 
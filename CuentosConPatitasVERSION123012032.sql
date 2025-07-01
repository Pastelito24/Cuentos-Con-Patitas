
create database BD_CUENTOSCONPATITAS
;
use BD_CUENTOSCONPATITAS
;

CREATE TABLE Fundaciones 
(fundacion_id INT primary key not null AUTO_INCREMENT,
nit BIGINT(30) not null,
nombre VARCHAR(50) not null,
direccion VARCHAR(50) not null,
telefono BIGINT(10) not null,
email VARCHAR(50) not null,
persona_acargo VARCHAR(50) not null,
contrasena VARCHAR (250) not null,
foto_url VARCHAR (500),
descripcion TEXT)
;

ALTER TABLE Fundaciones  AUTO_INCREMENT = 10000;

Insert Into Fundaciones (nit,nombre,direccion,telefono,email,persona_acargo,contrasena,foto_url,descripcion) 
Values 
(12345678,'Patitas felices','Carrera 7A Transversal #45 12',3224587454,'patitasfelices@gmail.com','Esteban Jaramillo','Patitasfe2345','https://baluka.es/cdn/shop/articles/razas-de-perros-mas-comunes.jpg?v=1695689090&width=1920','Fundacion enfocada en el rescate cuidado y recuperación de peros maltratados o con traumas sufridos por dueños irresponsables'), 
(87654321,'Huellitas','Carrera 10A Norte #84 22',3005471289,'Huellitas@gmail.com','Johanna Morales','hue2345Inicio','https://ichef.bbci.co.uk/ace/ws/800/cpsprodpb/15665/production/_107435678_perro1.jpg.webp','Somos un grupo de amor y cariño para todos los animalitos que son encontrados en situación de calle con el fin de darles una mejor vida'),
(78945612,'PICOPICO','Calle 40B Nort # 17 84',3214758412,'PICOPICO@gmail.com','Ronaldo Nasario','PioPio45689','https://imagenes.eltiempo.com/files/image_1200_535/uploads/2024/12/04/675082f524ae6.png','Somos una familia que tiene cariño y amor para entregar a una mascota y poder conectarla con una persona o personas que sientan el mismo amor de querer, adoptar y ayudar a un animalito')
;

UPDATE fundaciones
SET email = 'ivanrodrigopatinoplaza.1996@gmail.com'
WHERE fundacion_id = 10001;

ALTER TABLE Fundaciones
ADD COLUMN banco VARCHAR(50) DEFAULT NULL,
ADD COLUMN tipo_cuenta VARCHAR(20) DEFAULT NULL,
ADD COLUMN numero_cuenta VARCHAR(30) DEFAULT NULL,
ADD COLUMN titular_cuenta VARCHAR(100) DEFAULT NULL,
ADD COLUMN telefono_contacto VARCHAR(20) DEFAULT NULL;

CREATE TABLE Eventos

(Id_evento INT primary key not null  auto_increment,
fundacion_id INT Null,
nombreEvento varchar(50) not null,
nombrefundacion varchar(50) not null,
fecha datetime not null,
Descripcion text not null,
nombrelugar varchar(100) null,
evento_imagen varchar(500) null,
foreign key (fundacion_id) References Fundaciones(fundacion_id)
);
ALTER TABLE eventos
MODIFY fecha date NOT NULL;

ALTER TABLE Eventos MODIFY fecha DATETIME;

ALTER TABLE eventos
DROP FOREIGN KEY eventos_ibfk_1;

ALTER TABLE eventos
ADD CONSTRAINT eventos_ibfk_1
FOREIGN KEY (fundacion_id) REFERENCES fundaciones(fundacion_id)
ON DELETE CASCADE;

INSERT INTO Eventos (fundacion_id, nombreEvento, nombrefundacion, fecha, Descripcion, nombrelugar, evento_imagen) 
VALUES 
(10000,'Evento de Recaudación', 'Huellitas', '2023-06-15 18:00:00', 'Recaudación de fondos para las fundaciones', 'Parque Timiza', 'https://bogota.gov.co/sites/default/files/styles/1050px/public/eventos/2023-06/adoptaton.jpg'),
(10001,'Conciencia Animal', 'PICOPICO', '2023-07-20 09:00:00', 'Evento para crear conciencia sobre el cuidado animal', 'Centro Comercial Titan', 'https://wakypet.com/wakypet-fiesta-eventos-corporativos-mascotas/imgs/alma.webp'),
(10002,'Picnic Solidario', 'PICOPICO', '2023-08-25 11:00:00', 'Picnic para recolectar alimentos para animales sin hogar', 'Parque Simon Bolivar', 'https://www.vistazo.com/binrepository/744x548/0c0/0d0/none/12727/VBHE/sin-ti-tulo_1688391_20240812105502.png');


CREATE TABLE  Animales

(animal_id INT not null AUTO_INCREMENT primary key,
fundacion_id INT null,
nombre VARCHAR(30) not null,
edad INT(2) not null,
fecha_ingreso DATE not null,
disponibilidad BIT not null,
tipo_animal ENUM('perro', 'gato') not null,
peso FLOAT null,
condicion TEXT null,
raza VARCHAR(45) null,
fotoanimal_url VARCHAR(500) null,
descripcion TEXT null,
genero ENUM('macho','hembra') not null,
foreign key (fundacion_id) references Fundaciones(fundacion_id))
;

ALTER TABLE Animales  AUTO_INCREMENT = 40000;

ALTER TABLE animales
DROP FOREIGN KEY animales_ibfk_1;

ALTER TABLE animales
ADD CONSTRAINT animales_ibfk_1
FOREIGN KEY (fundacion_id) REFERENCES fundaciones(fundacion_id)
ON DELETE CASCADE;



Insert Into Animales (fundacion_id,nombre,Edad,fecha_ingreso,disponibilidad,tipo_animal,peso,condicion,raza,fotoanimal_url,descripcion,genero) 
Values 
(10000, 'Sálomon', 7, '2024-04-15', 1, 'Perro', 20.5, 'Ninguna', 'Mestizo', 'https://www.faunayaccion.com/img/animals/vango_perros_actores_perros_gigantes_40kg_80kg_mestizo_gigante_ba3899.jpeg?t=1750519482', 'Hola soy un perrito activo y cariñoso con muchas ganas de tener un nuevo hogar', 'macho'),
(10001, 'Sumi', 3, '2024-06-26', 1, 'Perro', 24.7, 'Ninguna', 'Cruce de pitbull','https://www.faunayaccion.com/img/animals/simba_perros_actores_perros_gigantes_40kg_80kg_mestizo_gigante_7b3c01.jpeg?t=1750519508', 'Soy una perrita grande pero con espiritu aventurero lista para acompañarte y poder iniciar grandes aventuras', 'hembra'),
(10002, 'RinRin', 4, '2024-07-10', 1, 'Gato', 4.6, 'Ninguna', 'Criollo','https://i.pinimg.com/736x/72/77/3c/72773c6ea9992993b2933bf79400a884.jpg', 'Hola soy RinRin un gatico muy hablador de gran compañia para ti  y tu familia', 'macho')
;

/*
UPDATE animales
SET fotoanimal_url = '/static/animales/10003_animal_images.jpg'
WHERE fundacion_id = 10003;
*/

CREATE TABLE  Usuarios

(usuario_id INT not null primary key AUTO_INCREMENT,
fundacion_id INT null, 
cedula INT(10) not null,
contrasena VARCHAR (250) not null,
rol ENUM('Usuario', 'Fundaciones', 'Administradores') not null,
nombre VARCHAR(30) not null,
telefono BIGINT(10) not null,
email VARCHAR(50) not null,
direccion VARCHAR(50) not null,
edad INT(2) not null,
fecha_registro DATE not null,
usuariofoto_url varchar(500),
FOREIGN KEY (fundacion_id) REFERENCES Fundaciones (fundacion_id));

ALTER TABLE usuarios
DROP FOREIGN KEY usuarios_ibfk_1;

ALTER TABLE usuarios
ADD CONSTRAINT usuarios_ibfk_1
FOREIGN KEY (fundacion_id) REFERENCES fundaciones(fundacion_id)
ON DELETE SET NULL;


Insert Into Usuarios (fundacion_id,cedula,contrasena,rol,nombre,telefono,email,direccion,edad,fecha_registro,usuariofoto_url) 
Values 
(10000, 1468101214, 'Gatitosfan123', 'Usuario', 'Saray Manajarrez', 3457884567, 'Saraymanja@gmail.com', 'Calle 34 A Norte #10 30', 19, '2025-03-25', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKZtqfXYLb6STY0Ljvd4BavB1XgJoIGoi73A&s'),
(10001, 1691215180, 'Huellitasperronas987', 'Fundaciones', 'Johanna Morales', 3005471289, 'Huellitas@gmail.com', 'Carrera 10A Norte #84 22', 45, '2025-02-15', 'https://cdn.pixabay.com/photo/2016/11/29/13/14/attractive-1869761_1280.jpg'),
(10002, 1140914672, 'Brayan0802', 'Administradores', 'Brayan Ramirez', 3228433053, 'Brayandavidramirezr2006@gmail.com', 'Calle 77 F Sur # 67 34', 19, '2024-05-08', 'https://www.vice.com/wp-content/uploads/sites/2/2017/09/1505469702408-1505424666537-1505214661961-emil.jpeg'),
(10001, 1512162024, 'perrosforevers', 'Usuario', 'Carol Sierra', 3451238595, 'CarolSS@gmail.com', 'Carrera 7A Sur #20 15', 22, '2025-04-15', 'https://img.freepik.com/foto-gratis/mujer-sonriente-tiro-medio-pasando-tiempo-al-aire-libre_23-2150360996.jpg?semt=ais_hybrid&w=740')
;

CREATE TABLE Adopciones

(adopcion_id INT not null AUTO_INCREMENT primary key,
animal_id INT null,
usuario_id INT null,
nombre_adoptante VARCHAR(30) not null,
cedula_adoptante INT(10) not null,
fecha_adopcion DATE not null, 
estado_adopcion ENUM ('en proceso','adoptado','no adoptado') not null, 
foreign key (usuario_id) references Usuarios(usuario_id),
foreign key (animal_id) references Animales(animal_id))
;

ALTER TABLE Adopciones  AUTO_INCREMENT = 60000;

ALTER TABLE adopciones
DROP FOREIGN KEY adopciones_ibfk_2;

ALTER TABLE adopciones
ADD CONSTRAINT adopciones_ibfk_2
FOREIGN KEY (animal_id) REFERENCES animales(animal_id)
ON DELETE CASCADE;

ALTER TABLE adopciones
DROP FOREIGN KEY adopciones_ibfk_1;

ALTER TABLE adopciones
ADD CONSTRAINT adopciones_ibfk_1
FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id)
ON DELETE SET NULL;

Insert Into Adopciones (animal_id,usuario_id,nombre_adoptante,cedula_adoptante,fecha_adopcion,estado_adopcion) 
Values 
(40000, 1, 'Saray Manajarrez', 1468101214, '2025-03-28', 'en proceso'),
(40001, 2, 'Johanna Morales', 1691215180, '2025-04-20', 'en proceso')
;

CREATE TABLE Donaciones
(donacion_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
usuario_id INT NULL,
nombre_usuario VARCHAR(30) not null,
cedula_usuario INT(10) not null,
fundacion_id INT NULL,
Tipo_Donacion Enum('Monetario','Alimento','Otros'),
fecha_donacion DATE NOT NULL,
Descripcion text,
FOREIGN KEY (fundacion_id) REFERENCES Fundaciones (fundacion_id),
FOREIGN KEY (usuario_id) REFERENCES Usuarios (usuario_id))
;

ALTER TABLE Donaciones  AUTO_INCREMENT = 70000;

ALTER TABLE donaciones
DROP FOREIGN KEY donaciones_ibfk_1;

ALTER TABLE donaciones
ADD CONSTRAINT donaciones_ibfk_1
FOREIGN KEY (fundacion_id) REFERENCES fundaciones(fundacion_id)
ON DELETE CASCADE;

ALTER TABLE donaciones
DROP FOREIGN KEY donaciones_ibfk_2;

ALTER TABLE donaciones
ADD CONSTRAINT donaciones_ibfk_2
FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id)
ON DELETE SET NULL;

ALTER TABLE donaciones
ADD COLUMN estado_pago ENUM('pendiente','aprobado','rechazado','fallido','cancelado') DEFAULT 'pendiente',
ADD COLUMN referencia_pago VARCHAR(64) DEFAULT NULL,
ADD COLUMN metodo_pago VARCHAR(32) DEFAULT NULL,
ADD COLUMN monto DECIMAL(10,2) DEFAULT NULL,
ADD COLUMN moneda VARCHAR(8) DEFAULT 'COP',
ADD COLUMN respuesta_api TEXT DEFAULT NULL;

Insert Into Donaciones (usuario_id,fundacion_id,nombre_usuario,cedula_usuario,Tipo_Donacion,fecha_donacion,Descripcion) 
Values 
(1, 10000, 'Saray Manajarrez', 1468101214, 'Alimento', '2025-04-08', 'Hago entrega de 2 kilos de comida de perro de la marca Monello'),
(2, 10001,  'Johanna Morales', 1691215180, 'Otros', '2025-05-19', 'Entrega de cobijas, huesitos, camas, medicamentos, etc.')
;

CREATE TABLE Reportes

(reporte_id INT not null AUTO_INCREMENT primary key,
animal_id INT null,
fecha_creacion DATE not null,
descripcion TEXT not null,
foreign key (animal_id) references Animales(animal_id))
;

ALTER TABLE Reportes  AUTO_INCREMENT = 80000;

ALTER TABLE reportes
DROP FOREIGN KEY reportes_ibfk_1;

ALTER TABLE reportes
ADD CONSTRAINT reportes_ibfk_1
FOREIGN KEY (animal_id) REFERENCES animales(animal_id)
ON DELETE CASCADE;

Insert Into Reportes (animal_id,fecha_creacion,descripcion) 
Values 
(40000, '2024-08-01', 'El canino de nombre Sálomon no presenta ningún historial o cosas a tener en cuenta con su salud, presentando una amigable personalidad para la compañía de una gran familia.'),
(40001, '2024-12-19', 'El felino de nombre Sumi presenta síntomas leves de problemas en la vista. Se recomienda el tratamiento con gotas y pastillas (recomendable molerlas y mezclarlas en sus alimentos).')
;


/*
CREATE TABLE Recursos

(Id_recurso INT not null AUTO_INCREMENT primary key,
animal_id INT null,
Imagenes BLOB not null,
foreign key (animal_id) references Animales(animal_id))
;

ALTER TABLE Recursos  AUTO_INCREMENT = 90000;

ALTER TABLE recursos
DROP FOREIGN KEY recursos_ibfk_1;

ALTER TABLE recursos
ADD CONSTRAINT recursos_ibfk_1
FOREIGN KEY (animal_id) REFERENCES animales(animal_id)
ON DELETE CASCADE;

Insert Into Recursos (animal_id,imagenes) 
Values 
(40000,'https://content.elmueble.com/medio/2025/03/18/perro-de-raza-doberman_22d1acaa_250318172405_900x900.webp'),
(40001,'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRXXa3kjj1GcP_cowvEMEXTC95wibezcin_9eI2LI4DofpCrkiOMOx5nAFMQskusysPiyYta5EhT5wz4XHmw8iPnQ')
;
*/


select * from usuarios;
select * from fundaciones;
select * from animales;
select * from eventos;
select * from adopciones;
select * from donaciones;




from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timezone

db = SQLAlchemy()


class Usuario(db.Model):
    __tablename__ = 'usuario' 
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    nombres = db.Column(db.String(30), nullable=True)
    apellidos = db.Column(db.String(20), nullable=True)
    password_hash = db.Column(db.String(300), nullable=False)
    telefono = db.Column(db.String(20), nullable=True)   
    creado = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
   
    reserva_de_usuarios = db.relationship('Reserva', backref='usuario')
    restaurantes_fav= db.relationship('Restaurantes_Favoritos', backref='usuario')
    usuario_valoracion = db.relationship('Valoracion', backref='usuario')

    def __repr__(self):
        return f'<Usuario {self.email}>'

    # Método para generar el hash de la contraseña
    def set_password(self, password):
        """Genera el hash de la contraseña para almacenarlo"""
        self.password_hash = generate_password_hash(password)

    # Método para verificar si la contraseña proporcionada coincide con el hash almacenado
    def check_password(self, password):
        """Verifica si la contraseña proporcionada es válida"""
        return check_password_hash(self.password_hash, password)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "nombres": self.nombres,
            "apellidos": self.apellidos,
            "telefono": self.telefono,
            "creado": self.creado,
        }
    
from werkzeug.security import generate_password_hash, check_password_hash

class Restaurantes(db.Model):
    __tablename__ = 'restaurantes' 
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(30), unique=True, nullable=False)
    nombre = db.Column(db.String(30), unique=True, nullable=False)
    direccion = db.Column(db.String(40), nullable=True)
    latitud = db.Column(db.String(20), nullable=True)
    longitud = db.Column(db.String(20), nullable=True)
    telefono = db.Column(db.String(20), nullable=True)
    cubiertos = db.Column(db.Integer, nullable=True)
    cantidad_mesas = db.Column(db.Integer, nullable=True) 
    franja_horaria = db.Column(db.Integer, nullable=True)
    reservas_por_dia = db.Column(db.Integer, nullable=True)
    valoracion = db.Column(db.Integer, nullable=True)
    categorias_id = db.Column(db.Integer, db.ForeignKey('categorias.id'))
    
    # Añadido el campo para el hash de la contraseña
    password_hash = db.Column(db.String(300), nullable=False)

    # Relaciones con otras tablas
    restaurantes_fav = db.relationship('Restaurantes_Favoritos', backref='restaurantes') 
    restaurantes_res = db.relationship('Reserva', backref='restaurantes')
    restaurantes_mesa = db.relationship('Mesas', backref='restaurantes')
    restaurantes_valoracion = db.relationship('Valoracion', backref='restaurantes')

    def __repr__(self):
        return f'<Restaurantes {self.nombre}>'

    # Método para generar el hash de la contraseña
    def set_password(self, password):
        """Genera el hash de la contraseña para almacenarlo"""
        self.password_hash = generate_password_hash(password)

    # Método para verificar si la contraseña proporcionada coincide con el hash almacenado
    def check_password(self, password):
        """Verifica si la contraseña proporcionada es válida"""
        return check_password_hash(self.password_hash, password)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "nombre": self.nombre,
            "direccion": self.direccion,
            "latitud": self.latitud,
            "longitud": self.longitud,
            "telefono": self.telefono,
            "cubiertos": self.cubiertos,
            "franja_horaria": self.franja_horaria,
            "reservas_por_dia": self.reservas_por_dia,
            "valoracion": self.valoracion,
            "categorias_id": self.categorias_id,
            "restaurantes_mesa": list(map(lambda x: x.serialize(), self.restaurantes_mesa))
        }


class Reserva(db.Model):
        __tablename__ = 'reserva' 
        id = db.Column(db.Integer, primary_key=True)
        user_id = db.Column(db.Integer, db.ForeignKey('usuario.id'))
        fecha_reserva = db.Column(db.DateTime, nullable=False)
        trona = db.Column(db.Integer, nullable=False)
        adultos = db.Column(db.Integer, nullable=False)
        niños = db.Column(db.Integer, nullable=False)
        restaurante_id = db.Column(db.Integer, db.ForeignKey('restaurantes.id'))
        creada = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
        modificada = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))


        def __repr__(self):
            return f'<Reserva {self.id}>'

        def serialize(self):
            return {
            "id": self.id,
            "user_id": self.user_id,
            "fecha_reserva": self.fecha_reserva,
            "trona": self.trona,
            "adultos": self.adultos,
            "niños": self.niños,
            "restaurante_id": self.restaurante_id,
            "creada": self.creada,
            "modificada": self.modificada,
          }

class Mesas(db.Model):
        __tablename__ = 'mesas' 
        id = db.Column(db.Integer, primary_key=True)
        restaurante_id = db.Column(db.Integer, db.ForeignKey('restaurantes.id'))
        ubicacion = db.Column(db.String(30))
        capacidad = db.Column(db.Integer)
        disponibilidad = db.Column(db.Boolean(), nullable=False)
    
        def __repr__(self):
            return f'<Mesas {self.id}>'

        def serialize(self):
            return {
            "id": self.id,
            "restaurante_id": self.restaurante_id,
            "ubicacion": self.ubicacion,
            "capacidad": self.capacidad,
            "disponibilidad": self.disponibilidad
        }

class Categorias(db.Model):
        __tablename__ = 'categorias' 
        id = db.Column(db.Integer, primary_key=True)
        nombre_de_categoria = db.Column(db.String(30), nullable=False)

        categorias_resto = db.relationship('Restaurantes', backref=('categorias')) 


        def __repr__(self):
            return f'<Categorias {self.nombre_de_categoria}>'

        def serialize(self):
            return {
            "id": self.id,
            "nombre_de_categoria": self.nombre_de_categoria,
            "restaurantes_id": self.restaurantes_id
        }

class Restaurantes_Favoritos(db.Model):
        __tablename__ = 'restaurantes_favoritos'
        id = db.Column(db.Integer, primary_key=True)
        usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id'))
        restaurantes_id = db.Column(db.Integer, db.ForeignKey('restaurantes.id'))

        def __repr__(self):
            return f'<Restaurantes_favoritos {self.id}>'

        def serialize(self):
            return {
            "id": self.id,
            "usuario_id": self.usuario_id,
            "restaurantes_id": self.restaurantes_id
        }

class Valoracion(db.Model):
    __tablename__ = 'valoracion'
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id'))  # Usuario que deja la reseña
    restaurante_id = db.Column(db.Integer, db.ForeignKey('restaurantes.id'))  # Restaurante que está siendo valorado
    puntuacion = db.Column(db.Integer, nullable=False)  # Puntuación de 1 a 5, por ejemplo
    comentario = db.Column(db.Text, nullable=True)  # Comentario opcional del usuario
    fecha = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))  # Fecha en que se dejó la valoración
    
    def __repr__(self):
        return f'<Valoracion {self.puntuacion} del usuario {self.usuario_id} para restaurante {self.restaurante_id}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "usuario_id": self.usuario_id,
            "restaurante_id": self.restaurante_id,
            "puntuacion": self.puntuacion,
            "comentario": self.comentario,
            "fecha": self.fecha,
        }
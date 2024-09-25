from flask_sqlalchemy import SQLAlchemy, ForeigKey

db = SQLAlchemy()

class Usuario(db.Model):
    __tablename__ = 'usuario' 
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    nombre = db.Column(db.String(30), nullable=False)
    apellido = db. Column(db.String(20), nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    telefono = db.Column(db.String(20), unique=False, nullable=False)

    reservas_de_usuarios = db.relationship('Reservas', backref='usuario')
    restaurantes_fav= db.relationship('Restaurantes_Favoritos', backref='usuario')



    def __repr__(self):
        return f'<Usuario {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "nombre": self.nombre,
            "apellido": self.apellido,
            "telefono": self. telefono,
        }
    
class Restaurantes(db.Model):
        __tablename__ = 'restaurantes' 
        id = db.Column(db.Integer, primary_key=True),
        nombre = db.Column(db.String(30), unique=True, nullable=False),
        direccion = db.Column(db.String(40), nullable=False)
        latitud = db.Column(db.String(20), unique=True, nullable=False)
        longitud = db.Column(db.String(20), unique=True, nullable=False)
        telefono = db.Column(db.String(20), unique=True, nullable=False)
        cubiertos = db.Column(db.Integer)
        franja_horaria = db.Column(db.Integer)
        reservas_por_dia = db.Column(db.Integer)
        valoracion = db.Column(db.Integer)
        categoria_id = db.Column(db.Integer, ForeigKey=('Categorias.id'))

        restaurantes_fav= db.relationship('Restaurantes_Favoritos', backref='restaurantes')


        def __repr__(self):
            return f'<Restaurantes {self.email}>'

        def serialize(self):
            return {
            "id": self.id,
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
        }

class Reservas(db.Model):
        __tablename__ = 'reservas' 
        id = db.Column(db.Integer, primary_key=True)
        user_id = db.Column(db.Integer, ForeigKey=(Usuario.id))
        trona = db.Column(db.Boolean(), unique=True, nullable=False)
        adultos = db.Column(db.Integer, nullable=False)
        niños = db.Column(db.Integer, nullable=False)
        hora_inicio = db.Column(db.Datetime, nullable=False)
        hora_fin = db.Column(db.DateTime, nullable=False)
        estado_de_la_reserva = db.Column(db.String(20), nullable=False)
        restaurante_id = db.Column(db.String(20), ForeigKey=('Restaurantes.id'))
    
        def __repr__(self):
            return f'<Reservas {self.email}>'

        def serialize(self):
            return {
            "id": self.id,
            "user_id": self.user_id,
            "trona": self.trona,
            "adultos": self.adultos,
            "niños": self.niños,
            "hora_inicio": self.hora_inicio,
            "hora_fin": self.hora_fin,
            "estado_de_la_reserva": self.estado_de_la_reserva,
            "restaurante_id": self.restaurante_id,
        }

class Mesas(db.Model):
        __tablename__ = 'mesas' 
        id = db.Column(db.Integer, primary_key=True)
        restaurante_id = db.Column(db.String(20), ForeigKey=('Restaurantes.id'))
        ubicacion = db.Column(db.String(30))
        capacidad = db.Column(db.Integer)
        disponibilidad = db.Column(db.Boolean(), unique=True, nullable=False)
    
        def __repr__(self):
            return f'<Mesas {self.email}>'

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
        restaurantes_id = db.Column(db.Integer, ForeigKey=('Restaurantes.id'))

        def __repr__(self):
            return f'<Categorias {self.email}>'

        def serialize(self):
            return {
            "id": self.id,
            "nombre_de_categoria": self.nombre_de_categoria,
            "restaurantes_id": self.restaurantes_id
        }

class Restaurantes_Favoritos(db.Model):
        __tablename__ = 'restaurantes_favoritos'
        id = db.Column(db.Integer, primary_key=True)
        usuario_id = db.Column(db.Integer, ForeigKey=(Usuario.id))
        restaurantes_id = db.Column(db.Integer, ForeigKey=(Restaurantes.id))

        def __repr__(self):
            return f'<Restaurantes_favoritos {self.email}>'

        def serialize(self):
            return {
            "id": self.id,
            "usuario_id": self.usuario_id,
            "restaurantes_id": self.restaurantes_id
        }

   



      
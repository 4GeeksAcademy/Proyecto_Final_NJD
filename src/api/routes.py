"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import request, jsonify, Blueprint
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from api.models import db, Usuario, Reserva, Restaurantes_Favoritos, Valoracion, Restaurantes
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from datetime import datetime, timezone
import re  # Para validación de email, contraseña y teléfono

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

# Validar formato de email
def is_valid_email(email):
    email_regex = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(email_regex, email)

# Validar formato de contraseña (al menos una mayúscula y un número)
def is_valid_password(password):
    if len(password) < 8 or len(password) > 16:
        return False
    if not re.search(r'[A-Z]', password):  # Al menos una mayúscula
        return False
    if not re.search(r'[0-9]', password):  # Al menos un número
        return False
    return True

# Validar formato de teléfono
def is_valid_phone(phone):
    phone_regex = r'^[\d\+\-]+$'  # Permitir solo números, + y -
    if len(phone) < 9:  # Al menos 9 caracteres
        return False
    if not re.match(phone_regex, phone):
        return False
    return True

# Implementar la ruta /signup para el registro de usuarios:
@api.route('/signup', methods=['POST'])
def signup():
    body = request.get_json()
    email = body.get('email')
    password = body.get('password')
    nombres = body.get('nombres')
    apellidos = body.get('apellidos')
    telefono = body.get('telefono')

    # Validaciones de campos
    if not email or not password or not nombres or not apellidos or not telefono:
        return jsonify({'msg': 'Faltan datos'}), 400

    if not is_valid_email(email):
        return jsonify({'msg': 'Formato de email no válido'}), 400

    if not is_valid_password(password):
        return jsonify({'msg': 'La contraseña debe tener entre 8 y 16 caracteres, al menos una mayúscula y un número'}), 400

    if not is_valid_phone(telefono):
        return jsonify({'msg': 'Formato de teléfono no válido. Debe contener al menos 9 caracteres y solo números, +, y -'}), 400

    # Verificar si el usuario ya existe
    if Usuario.query.filter_by(email=email).first():
        return jsonify({'msg': 'El usuario ya existe'}), 409  # Conflicto

    # Crear el nuevo usuario
    new_user = Usuario(
        email=email,
        nombres=nombres,
        apellidos=apellidos,
        telefono=telefono,
        creado=datetime.now(timezone.utc)
    )
    new_user.set_password(password)  # Genera el hash de la contraseña
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'msg': 'Usuario registrado con éxito'}), 201

# Implementar la ruta /login para iniciar sesión:
@api.route('/login', methods=['POST'])
def login():
    body = request.get_json()
    email = body.get('email')
    password = body.get('password')

    if not email or not password:
        return jsonify({'msg': 'Credenciales inválidas'}), 401

    # Verificar si el usuario existe en la base de datos
    user = Usuario.query.filter_by(email=email).first()
    if user is None:
        return jsonify({'msg': 'El usuario no está registrado'}), 404

    # Verificar si la contraseña es correcta
    if not user.check_password(password):
        return jsonify({'msg': 'Contraseña incorrecta'}), 401

    # Generar el Access Token y Refresh Token
    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)

    return jsonify({
        'access_token': access_token,
        'refresh_token': refresh_token
    }), 200

# Ruta para generar un nuevo Access Token usando el Refresh Token
@api.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user_id = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user_id)
    return jsonify({
        'access_token': new_access_token
    }), 200

# Ruta protegida con JWT, requiere token válido
@api.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user_id = get_jwt_identity()  # Recupera el ID del usuario a partir del JWT
    user = Usuario.query.get(current_user_id)

    if user is None:
        return jsonify({'msg': 'Usuario no encontrado'}), 404

    return jsonify({
        'id': user.id,
        'email': user.email,
        'nombres': user.nombres,
        'apellidos': user.apellidos,
        'telefono': user.telefono,
        'creado': user.creado.isoformat()
    }), 200

# Ruta para validar un token JWT
@api.route('/validate-token', methods=['GET'])
@jwt_required()
def validate_token():
    current_user_id = get_jwt_identity()  # Recupera el ID del usuario del JWT
    user = Usuario.query.get(current_user_id)

    if user is None:
        return jsonify({'msg': 'Usuario no encontrado'}), 404

    return jsonify({'msg': 'Token válido', 'user_id': user.id, 'email': user.email}), 200

# Obtener todos los usuarios (GET /usuarios)
@api.route('/usuarios', methods=['GET'])
def get_all_users():
    usuarios = Usuario.query.all()
    return jsonify([usuario.serialize() for usuario in usuarios]), 200

# Obtener un usuario por su ID (GET /usuario/<int:usuario_id>)
@api.route('/usuario/<int:usuario_id>', methods=['GET'])
@jwt_required()
def get_user(usuario_id):
    usuario = Usuario.query.get(usuario_id)
    if not usuario:
        return jsonify({'msg': 'Usuario no encontrado'}), 404
    
    return jsonify(usuario.serialize()), 200

# Actualiza un usuario (PUT /usuario/<int:usuario_id>)
@api.route('/usuario/<int:usuario_id>', methods=['PUT'])
@jwt_required()
def update_user(usuario_id):
    body = request.get_json()
    usuario = Usuario.query.get(usuario_id)

    if not usuario:
        return jsonify({'msg': 'Usuario no encontrado'}), 404
    
    # Actualiza datos del usuario
    usuario.email = body.get('email', usuario.email)
    usuario.nombres = body.get('nombres', usuario.nombres)
    usuario.apellidos = body.get('apellidos', usuario.apellidos)
    usuario.telefono = body.get('telefono', usuario.telefono)

    if 'password' in body:
        usuario.set_password(body['password'])  # Actualizar la contraseña si se proporciona

    db.session.commit()

    return jsonify({'msg': 'Usuario actualizado con éxito'}), 200

# Eliminar un usuario (DELETE /usuario/<int:usuario_id>) 
@api.route('/usuario/<int:usuario_id>', methods=['DELETE'])
@jwt_required()
def delete_user(usuario_id):
    usuario = Usuario.query.get(usuario_id)

    if not usuario:
        return jsonify({'msg': 'Usuario no encontrado'}), 404

    db.session.delete(usuario)
    db.session.commit()

    return jsonify({'msg': 'Usuario eliminado con éxito'}), 200

# Crear un restaurante (POST /restaurantes)
@api.route('/signup/restaurante', methods=['POST'])
def signup_restaurante():
    body = request.get_json()

    nombre = body.get('nombre')
    email = body.get('email')
    direccion = body.get('direccion')
    latitud = body.get('latitud')
    longitud = body.get('longitud')
    telefono = body.get('telefono')
    cubiertos = body.get('cubiertos')
    cantidad_mesas = body.get('cantidad_mesas')
    franja_horaria = body.get('franja_horaria')
    reservas_por_dia = body.get('reservas_por_dia')
    categorias_id = body.get('categorias_id')

    # Validaciones de campos obligatorios
    if not nombre or not email or not direccion:
        return jsonify({'msg': 'Faltan datos obligatorios'}), 400

    if Restaurantes.query.filter_by(email=email).first():
        return jsonify({'msg': 'El restaurante ya existe'}), 409

    # Crear el nuevo restaurante
    nuevo_restaurante = Restaurantes(
        nombre=nombre,
        email=email,
        direccion=direccion,
        latitud=latitud,
        longitud=longitud,
        telefono=telefono,
        cubiertos=cubiertos,
        cantidad_mesas=cantidad_mesas,
        franja_horaria=franja_horaria,
        reservas_por_dia=reservas_por_dia,
        categorias_id=categorias_id
    )
    
    db.session.add(nuevo_restaurante)
    db.session.commit()

    return jsonify({'msg': 'Restaurante registrado con éxito'}), 201


# Implementar la ruta /login/restaurante para iniciar sesión de restaurantes
@api.route('/login/restaurante', methods=['POST'])
def login_restaurante():
    body = request.get_json()
    email = body.get('email')
    password = body.get('password')

    if not email or not password:
        return jsonify({'msg': 'Credenciales inválidas'}), 401

    # Verificar si el restaurante existe en la base de datos
    restaurante = Restaurantes.query.filter_by(email=email).first()
    if restaurante is None:
        return jsonify({'msg': 'El restaurante no está registrado'}), 404

    # Verificar si la contraseña es correcta (si tienes un campo para almacenar contraseñas)
    # Aquí se asume que tienes una función para validar contraseñas (similar a los usuarios)
    # if not restaurante.check_password(password):
    #    return jsonify({'msg': 'Contraseña incorrecta'}), 401

    # Generar el Access Token y Refresh Token
    access_token = create_access_token(identity=restaurante.id)
    refresh_token = create_refresh_token(identity=restaurante.id)

    return jsonify({
        'access_token': access_token,
        'refresh_token': refresh_token
    }), 200


# Obtener todos los restaurantes (GET /restaurantes)
@api.route('/restaurantes', methods=['GET'])
def get_all_restaurantes():
    restaurantes = Restaurantes.query.all()
    return jsonify([restaurante.serialize() for restaurante in restaurantes]), 200

# Obtener un restaurante por su ID (GET /restaurantes/<int:restaurante_id>)
@api.route('/restaurantes/<int:restaurante_id>', methods=['GET'])
def get_restaurante(restaurante_id):
    restaurante = Restaurantes.query.get(restaurante_id)
    if not restaurante:
        return jsonify({'msg': 'Restaurante no encontrado'}), 404

    return jsonify(restaurante.serialize()), 200

# Actualizar un restaurante (PUT /restaurantes/<int:restaurante_id>)
@api.route('/restaurantes/<int:restaurante_id>', methods=['PUT'])
@jwt_required()  # Sólo los profesionales pueden actualizar los restaurantes
def update_restaurante(restaurante_id):
    body = request.get_json()
    restaurante = Restaurantes.query.get(restaurante_id)

    if not restaurante:
        return jsonify({'msg': 'Restaurante no encontrado'}), 404

    # Actualizar los campos del restaurante
    restaurante.nombre = body.get('nombre', restaurante.nombre)
    restaurante.email = body.get('email', restaurante.email)
    restaurante.direccion = body.get('direccion', restaurante.direccion)
    restaurante.latitud = body.get('latitud', restaurante.latitud)
    restaurante.longitud = body.get('longitud', restaurante.longitud)
    restaurante.telefono = body.get('telefono', restaurante.telefono)
    restaurante.cubiertos = body.get('cubiertos', restaurante.cubiertos)
    restaurante.franja_horaria = body.get('franja_horaria', restaurante.franja_horaria)
    restaurante.reservas_por_dia = body.get('reservas_por_dia', restaurante.reservas_por_dia)
    restaurante.valoracion = body.get('valoracion', restaurante.valoracion)
    restaurante.categorias_id = body.get('categorias_id', restaurante.categorias_id)

    db.session.commit()

    return jsonify({'msg': 'Restaurante actualizado con éxito'}), 200

# Eliminar un restaurante (DELETE /restaurantes/<int:restaurante_id>)
@api.route('/restaurantes/<int:restaurante_id>', methods=['DELETE'])
@jwt_required()  # Sólo los profesionales pueden eliminar los restaurantes
def delete_restaurante(restaurante_id):
    restaurante = Restaurantes.query.get(restaurante_id)

    if not restaurante:
        return jsonify({'msg': 'Restaurante no encontrado'}), 404

    db.session.delete(restaurante)
    db.session.commit()

    return jsonify({'msg': 'Restaurante eliminado con éxito'}), 200

#CREAR RESERVA

@api.route('/usuario/<int:usuario_id>/reservas', methods=['POST'])
def crear_reserva(usuario_id):
    body = request.get_json()
    
    restaurante_id = body.get('restaurante_id')
    fecha_reserva = body.get('fecha_reserva')
    adultos = body.get('adultos')
    niños = body.get('niños')
    trona= body.get('trona')
    hora_inicio = body.get('hora_inicio')
    hora_fin = body.get('hora_fin')
    estado_de_la_reserva = body.get('estado_de_la_reserva')

    if not all([usuario_id, restaurante_id, fecha_reserva, adultos, niños, trona]):
        return jsonify({"error": "Faltan datos para crear la reserva"}), 400

    nueva_reserva = Reserva(
        user_id=usuario_id,
        restaurante_id=restaurante_id,
        fecha_reserva=fecha_reserva,
        adultos=adultos,
        niños=niños,
        trona=trona,
        hora_inicio = hora_inicio,
        hora_fin = hora_fin,
        estado_de_la_reserva= estado_de_la_reserva
    )
    db.session.add(nueva_reserva)
    db.session.commit()
    
    return jsonify({"message": "Reserva creada con éxito", "reserva": nueva_reserva.serialize()}), 201

#OBTENER RESERVA

@api.route('/usuario/<int:user_id>/reservas', methods=['GET'])
def obtener_reservas_usuario(user_id):
    reservas = Reserva.query.filter_by(user_id=user_id).all()
    reservas_serializadas = list(map(lambda r: r.serialize(), reservas))
    
    return jsonify(reservas_serializadas), 200

#ACTUALIZAR RESERVA

@api.route('/reservas/<int:reserva_id>', methods=['PUT'])
def actualizar_reserva(reserva_id):
    body = request.get_json()
    
    reserva = Reserva.query.get(reserva_id)
    if not reserva:
        return jsonify({"error": "Reserva no encontrada"}), 404

    if 'fecha_reserva' in body:
        reserva.fecha_reserva = body['fecha_reserva']
    if 'numero_personas' in body:
        reserva.numero_personas = body['numero_personas']

    db.session.commit()
    
    return jsonify({"message": "Reserva actualizada con éxito", "reserva": reserva.serialize()}), 200

#BORRAR RESERVA

@api.route('/reservas/<int:reserva_id>', methods=['DELETE'])
def cancelar_reserva(reserva_id):
    reserva = Reserva.query.get(reserva_id)
    if not reserva:
        return jsonify({"error": "Reserva no encontrada"}), 404

    reserva.estado = "cancelada"
    db.session.commit()

    return jsonify({"message": "Reserva cancelada con éxito", "reserva": reserva.serialize()}), 200

#CREAR FAVORITOS

@api.route('/usuario/<int:usuario_id>/favoritos', methods=['POST'])
def agregar_favorito(usuario_id):

    body = request.json

    restaurante_id = body.get('restaurantes_id')

    if not usuario_id or not restaurante_id :
        return jsonify({"error": "Faltan datos para agregar a favoritos"}), 400

    favorito_existente = Restaurantes_Favoritos.query.filter_by(usuario_id=usuario_id, restaurantes_id=restaurante_id).first()
    if favorito_existente:
        return jsonify({"error": "El restaurante ya está en favoritos"}), 400

    nuevo_favorito = Restaurantes_Favoritos(usuario_id=usuario_id, restaurantes_id=restaurante_id)
    db.session.add(nuevo_favorito)
    db.session.commit()

    return jsonify({"message": "Restaurante agregado a favoritos", "favorito": nuevo_favorito.serialize()}), 201

#ELIMINAR FAVORITO

@api.route('/usuario/<int:usuario_id>/favoritos', methods=['DELETE'])
def eliminar_favorito():
    
    body = request.get_json()

    usuario_id = body.get('usuario_id')
    restaurante_id = body.get('restaurantes_id')

    if not all([usuario_id, restaurante_id]):
        return jsonify({"error": "Faltan datos para eliminar de favoritos"}), 400

    favorito = Restaurantes_Favoritos.query.filter_by(user_id=usuario_id, restaurante_id=restaurante_id).first()

    if not favorito:
        return jsonify({"error": "El restaurante no está en favoritos"}), 404

    db.session.delete(favorito)
    db.session.commit()

    return jsonify({"message": "Restaurante eliminado de favoritos"}), 200

#OBTENER FAVORITO

@api.route('/usuario/favoritos/<int:user_id>', methods=['GET'])
def obtener_favoritos(user_id):
    favoritos = Restaurantes_Favoritos.query.filter_by(user_id=user_id).all()
    all_favoritos = list(map(lambda x: x.serialize(), favoritos))
    
    return jsonify(all_favoritos), 200

#CREAR VALORACION

@api.route('/usuario/valoraciones', methods=['POST'])
def agregar_valoracion():
    body = request.get_json()

    user_id = body.get('user_id')
    restaurante_id = body.get('restaurante_id')
    puntuacion = body.get('puntuacion')
    comentario = body.get('comentario', "")

    if not all([user_id, restaurante_id, puntuacion]):
        return jsonify({"error": "Faltan datos para la valoración"}), 400

    valoracion_existente = Valoracion.query.filter_by(user_id=user_id, restaurante_id=restaurante_id).first()
    if valoracion_existente:
        return jsonify({"error": "Ya has valorado este restaurante"}), 400

    nueva_valoracion = Valoracion(
        user_id=user_id,
        restaurante_id=restaurante_id,
        puntuacion=puntuacion,
        comentario=comentario
    )
    
    db.session.add(nueva_valoracion)
    db.session.commit()

    return jsonify({"message": "Valoración creada con éxito", "valoracion": nueva_valoracion.serialize()}), 201

#ACTUALIZAR VALORACION

@api.route('/usuario/valoraciones', methods=['PUT'])
def actualizar_valoracion():
    body = request.get_json()

    user_id = body.get('user_id')
    restaurante_id = body.get('restaurante_id')
    puntuacion = body.get('puntuacion')
    comentario = body.get('comentario', "")

    if not all([user_id, restaurante_id, puntuacion]):
        return jsonify({"error": "Faltan datos para poder actualizar la valoración"}), 400

    valoracion_existente = Valoracion.query.filter_by(user_id=user_id, restaurante_id=restaurante_id).first()
    if not valoracion_existente:
        return jsonify({"error": "No se encontró ninguna valoración para este restaurante hecha por este usuario"}), 404

    valoracion_existente.puntuacion = puntuacion
    valoracion_existente.comentario = comentario
    db.session.commit()

    return jsonify({"message": "Valoración actualizada con éxito", "valoracion": valoracion_existente.serialize()}), 200

#BORRAR VALORACION

@api.route('/usuario/valoraciones', methods=['DELETE'])
def eliminar_valoracion():
    body = request.get_json()

    user_id = body.get('user_id')
    restaurante_id = body.get('restaurante_id')

    if not all([user_id, restaurante_id]):
        return jsonify({"error": "Faltan datos para  poder eliminar la valoración"}), 400

    valoracion = Valoracion.query.filter_by(user_id=user_id, restaurante_id=restaurante_id).first()

    if not valoracion:
        return jsonify({"error": "No existe una valoración para este restaurante"}), 404

    db.session.delete(valoracion)
    db.session.commit()

    return jsonify({"message": "Valoración eliminada con éxito"}), 200

#OBTENER VALORACION

@api.route('/restaurante/<int:restaurante_id>/valoracion', methods=['GET'])
def obtener_valoracion_restaurante(restaurante_id):
    valoraciones = Valoracion.query.filter_by(restaurante_id=restaurante_id).all()
    
    if not valoraciones:
        return jsonify({"message": "Este restaurante no tiene valoraciones"}), 200
    
    all_valoraciones = list(map(lambda x: x.serialize(), valoraciones))
    
    return jsonify(all_valoraciones), 200

#PROMEDIAR VALORACIONES

@api.route('/restaurante/<int:restaurante_id>/valoracion_promedio', methods=['GET'])
def obtener_valoracion_promedio(restaurante_id):
    valoraciones = Valoracion.query.filter_by(restaurante_id=restaurante_id).all()

    if not valoraciones:
        return jsonify({"message": "Este restaurante no tiene valoraciones"}), 200

    total_valoraciones = sum([valoracion.puntuacion for valoracion in valoraciones])
    promedio = total_valoraciones / len(valoraciones)

    return jsonify({"restaurante_id": restaurante_id, "promedio_valoracion": promedio}), 200

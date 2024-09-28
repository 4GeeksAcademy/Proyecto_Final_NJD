"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, Blueprint
from api.models import db, Usuario
from api.models import db, Restaurantes
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
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


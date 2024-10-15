"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import request, jsonify, Blueprint
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from api.models import db, Usuario, Reserva, Restaurantes_Favoritos, Valoracion, Restaurantes, Categorias
from api.utils import validar_horario_reserva, generate_sitemap, APIException
from flask_cors import CORS
from datetime import datetime, timezone
from werkzeug.security import check_password_hash, generate_password_hash
import re 
import cloudinary.uploader

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

def is_valid_email(email):
    email_regex = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(email_regex, email)

def is_valid_password(password):
    if len(password) < 8 or len(password) > 16:
        return False
    if not re.search(r'[A-Z]', password):  # Al menos una mayúscula
        return False
    if not re.search(r'[0-9]', password):  # Al menos un número
        return False
    return True


def is_valid_phone(phone):
    # Permitir solo números, +, -, y espacios
    phone_regex = r'^[\d\+\-\s]+$'
    if len(phone) < 9:  
        return False
    if not re.match(phone_regex, phone):
        return False
    return True


# REGISTRO USUARIO

@api.route('/signup', methods=['POST'])
def signup():
    body = request.get_json()
    
    email = body.get('email')
    password = body.get('password')
    nombres = body.get('nombres')
    apellidos = body.get('apellidos')
    telefono = body.get('telefono')

    if not email or not password or not nombres or not apellidos or not telefono:
        return jsonify({'msg': 'Faltan datos'}), 400

    if not is_valid_email(email):
        return jsonify({'msg': 'Formato de email no válido'}), 400

    if not is_valid_password(password):
        return jsonify({'msg': 'La contraseña debe tener entre 8 y 16 caracteres, al menos una mayúscula y un número'}), 400

    if not is_valid_phone(telefono):
        return jsonify({'msg': 'Formato de teléfono no válido. Debe contener al menos 9 caracteres y solo números, +, y -'}), 400

    if Usuario.query.filter_by(email=email).first():
        return jsonify({'msg': 'El usuario ya existe'}), 409  

    new_user = Usuario(
        email=email,
        nombres=nombres,
        apellidos=apellidos,
        telefono=telefono,
        creado=datetime.now(timezone.utc)
    )
    new_user.set_password(password)  
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'msg': 'Usuario registrado con éxito'}), 201
 



# INICIO SESION USUARIO

@api.route('/login', methods=['POST'])
def login():
    body = request.get_json()
    email = body.get('email')
    password = body.get('password')

    if not email or not password:
        return jsonify({'msg': 'Credenciales inválidas'}), 401

    user = Usuario.query.filter_by(email=email).first()
    if user is None:
        return jsonify({'msg': 'El usuario no está registrado'}), 404

    if not user.check_password(password):
        return jsonify({'msg': 'Contraseña incorrecta'}), 401

    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)

    return jsonify({
        'access_token': access_token,
        'refresh_token': refresh_token,
        'user_name': user.nombres, 
        'user_id': user.id
    }), 200



# USAMOS REFRESH TOKEN PARA GENERAR UNO NUEVO AUTOMATICAMENTE

@api.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user_id = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user_id)
    return jsonify({
        'access_token': new_access_token
    }), 200



# RUTA PROTEGIDA CON TOKEN

@api.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user_id = get_jwt_identity()  
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


# VALIDAR EL TOKEN

@api.route('/validate-token', methods=['GET'])
@jwt_required()
def validate_token():
    current_user_id = get_jwt_identity()  
    user = Usuario.query.get(current_user_id)

    if user is None:
        return jsonify({'msg': 'Usuario no encontrado'}), 404

    return jsonify({'msg': 'Token válido', 'user_id': user.id, 'email': user.email}), 200

# OBTENER TODOS LOS USUARIOS

@api.route('/usuarios', methods=['GET'])
def get_all_users():
    usuarios = Usuario.query.all()
    return jsonify([usuario.serialize() for usuario in usuarios]), 200

# OBTENER UN USUARIO

@api.route('/usuario/<int:usuario_id>', methods=['GET'])
@jwt_required()
def get_user(usuario_id):
    usuario = Usuario.query.get(usuario_id)
    if not usuario:
        return jsonify({'msg': 'Usuario no encontrado'}), 404
    
    return jsonify(usuario.serialize()), 200

# ACTUALIZAR USUARIO

@api.route('/usuario/<int:usuario_id>', methods=['PUT'])
@jwt_required()
def update_user(usuario_id):
    body = request.get_json()
    usuario = Usuario.query.get(usuario_id)

    if not usuario:
        return jsonify({'msg': 'Usuario no encontrado'}), 404
    
    # Actualiza datos del usuario
    usuario.nombres = body.get('nombres', usuario.nombres)
    usuario.apellidos = body.get('apellidos', usuario.apellidos)
    usuario.telefono = body.get('telefono', usuario.telefono)

    if 'password' in body:
        usuario.set_password(body['password'])  

    db.session.commit()

    return jsonify({'msg': 'Usuario actualizado con éxito'}), 200

# ELIMINAR UN USUARIO

@api.route('/usuario/<int:usuario_id>', methods=['DELETE'])
@jwt_required()
def delete_user(usuario_id):
    usuario = Usuario.query.get(usuario_id)

    if not usuario:
        return jsonify({'msg': 'Usuario no encontrado'}), 404

    db.session.delete(usuario)
    db.session.commit()

    return jsonify({'msg': 'Usuario eliminado con éxito'}), 200



# REGISTRO BASICO RESTAURANTE

@api.route('/signup/restaurante', methods=['POST'])
def signup_restaurante():
    body = request.get_json()

    nombre = body.get('nombre')
    email = body.get('email')
    password = body.get('password')
    telefono = body.get('telefono')

    if not (nombre and email and password and telefono):
        return jsonify({'msg': 'Faltan datos obligatorios'}), 400

    if Restaurantes.query.filter_by(email=email).first():
        return jsonify({'msg': 'El restaurante ya existe'}), 409

    hashed_password = generate_password_hash(password)

    nuevo_restaurante = Restaurantes(
        nombre=nombre,
        email=email,
        telefono=telefono,
        password_hash=hashed_password  
    )

    db.session.add(nuevo_restaurante)
    db.session.commit()

    return jsonify({'msg': 'Restaurante registrado con éxito', 'restaurante_id': nuevo_restaurante.id}), 201

# REGISTRO COMPLETO RESTAURANTE

@api.route('/restaurante/<int:restaurante_id>/completar', methods=['PUT'])
@jwt_required()
def completar_registro_restaurante(restaurante_id):
    body = request.get_json()

    restaurante = Restaurantes.query.get_or_404(restaurante_id)

    if restaurante.registro_completo:
        return jsonify({'msg': 'El restaurante ya ha completado su registro'}), 400

    restaurante.direccion = body.get('direccion', restaurante.direccion)
    restaurante.cubiertos = body.get('cubiertos', restaurante.cubiertos)
    restaurante.cantidad_mesas = body.get('cantidad_mesas', restaurante.cantidad_mesas)
    restaurante.horario_mañana_inicio = body.get('horario_mañana_inicio', restaurante.horario_mañana_inicio)
    restaurante.horario_mañana_fin = body.get('horario_mañana_fin', restaurante.horario_mañana_fin)
    restaurante.horario_tarde_inicio = body.get('horario_tarde_inicio', restaurante.horario_tarde_inicio)
    restaurante.horario_tarde_fin = body.get('horario_tarde_fin', restaurante.horario_tarde_fin)
    restaurante.reservas_por_dia = body.get('reservas_por_dia', restaurante.reservas_por_dia)
    restaurante.categorias_id = body.get('categorias_id', restaurante.categorias_id)

    if all([restaurante.direccion, restaurante.cubiertos, restaurante.cantidad_mesas, 
            restaurante.horario_mañana_inicio, restaurante.horario_mañana_fin,
            restaurante.horario_tarde_inicio, restaurante.horario_tarde_fin, restaurante.categorias_id]):
        restaurante.registro_completo = True
    else:
        return jsonify({'msg': 'Faltan datos para completar el registro'}), 400

    db.session.commit()

    return jsonify({'msg': 'Registro completado con éxito', 'registro_completo': restaurante.registro_completo}), 200



# LOGIN RESTAURANTE

@api.route('/login/restaurante', methods=['POST'])
def login_restaurante():
    body = request.get_json()
    email = body.get('email')
    password = body.get('password')

    if not email or not password:
        return jsonify({'msg': 'Credenciales inválidas'}), 401

    restaurante = Restaurantes.query.filter_by(email=email).first()
    if restaurante is None:
        return jsonify({'msg': 'El restaurante no está registrado'}), 404

    if not restaurante.check_password(password):
        return jsonify({'msg': 'Contraseña incorrecta'}), 401

    access_token = create_access_token(identity=restaurante.id)
    refresh_token = create_refresh_token(identity=restaurante.id)

    campos_obligatorios = [restaurante.direccion, restaurante.cubiertos, restaurante.cantidad_mesas, 
                           restaurante.horario_mañana_inicio, restaurante.horario_mañana_fin, 
                           restaurante.horario_tarde_inicio, restaurante.horario_tarde_fin, restaurante.categorias_id]
    
    registro_completo = all(campos_obligatorios)

    return jsonify({
        'access_token': access_token,
        'refresh_token': refresh_token,
        'restaurant_name': restaurante.nombre,  
        'restaurant_id': restaurante.id,
        'registro_completo': registro_completo  
    }), 200




# OBTENER TODOS LOS RESTAURANTES

@api.route('/restaurantes', methods=['GET'])
def get_all_restaurantes():
    restaurantes = Restaurantes.query.all()
    return jsonify([restaurante.serialize() for restaurante in restaurantes]), 200


# OBTENER UN RESTAURANTE

@api.route('/restaurantes/<int:restaurante_id>', methods=['GET'])
def get_restaurante(restaurante_id):
    restaurante = Restaurantes.query.get(restaurante_id)
    if not restaurante:
        return jsonify({'msg': 'Restaurante no encontrado'}), 404

    return jsonify(restaurante.serialize()), 200



# ACTUALIZAR DATOS RESTAURANTE DESDE LA PÁGINA PRIVADA

@api.route('/restaurantes/<int:restaurante_id>', methods=['PUT'])
@jwt_required()
def update_restaurante(restaurante_id):
    body = request.get_json()
    restaurante = Restaurantes.query.get(restaurante_id)

    if not restaurante:
        return jsonify({'msg': 'Restaurante no encontrado'}), 404

    nuevo_email = body.get('email', restaurante.email)
    if nuevo_email != restaurante.email and Restaurantes.query.filter_by(email=nuevo_email).first():
        return jsonify({'msg': 'El email ya está en uso'}), 409

    restaurante.nombre = body.get('nombre', restaurante.nombre)
    restaurante.email = nuevo_email
    restaurante.direccion = body.get('direccion', restaurante.direccion)
    restaurante.cubiertos = body.get('cubiertos', restaurante.cubiertos)
    restaurante.cantidad_mesas = body.get('cantidad_mesas', restaurante.cantidad_mesas)
    restaurante.telefono = body.get('telefono', restaurante.telefono)

    # Validar y actualizar los horarios
    try:
        if 'horario_mañana_inicio' in body:
            restaurante.horario_mañana_inicio = datetime.strptime(body['horario_mañana_inicio'], '%H:%M').time()
        if 'horario_mañana_fin' in body:
            restaurante.horario_mañana_fin = datetime.strptime(body['horario_mañana_fin'], '%H:%M').time()
        if 'horario_tarde_inicio' in body:
            restaurante.horario_tarde_inicio = datetime.strptime(body['horario_tarde_inicio'], '%H:%M').time()
        if 'horario_tarde_fin' in body:
            restaurante.horario_tarde_fin = datetime.strptime(body['horario_tarde_fin'], '%H:%M').time()
    except ValueError:
        return jsonify({"msg": "Formato de hora no válido, debe ser HH:MM"}), 400

    restaurante.reservas_por_dia = body.get('reservas_por_dia', restaurante.reservas_por_dia)
    restaurante.categorias_id = body.get('categorias_id', restaurante.categorias_id)

    db.session.commit()

    return jsonify({'msg': 'Restaurante actualizado con éxito'}), 200




# ELIMINAR RESTAURANTE

@api.route('/restaurantes/<int:restaurante_id>', methods=['DELETE'])
@jwt_required()  
def delete_restaurante(restaurante_id):
    restaurante = Restaurantes.query.get(restaurante_id)

    if not restaurante:
        return jsonify({'msg': 'Restaurante no encontrado'}), 404

    db.session.delete(restaurante)
    db.session.commit()

    return jsonify({'msg': 'Restaurante eliminado con éxito'}), 200



# CREAR CATEGORIA

@api.route('/categorias', methods=['POST'])
def create_categoria():
    data = request.json
    if isinstance(data, list):
        for categoria_data in data:
            nueva_categoria = Categorias(nombre_de_categoria=categoria_data['nombre_de_categoria'])
            db.session.add(nueva_categoria)
    else:
        nueva_categoria = Categorias(nombre_de_categoria=data['nombre_de_categoria'])
        db.session.add(nueva_categoria)
    
    db.session.commit()
    
    return jsonify({"message": "Categorías creadas correctamente"}), 201



# OBTENER TODAS LAS CATEGORIAS

@api.route('/categorias', methods=['GET'])
def get_categorias():
    categorias = Categorias.query.all()
    return jsonify([categoria.serialize() for categoria in categorias]), 200


# OBTENER UNA CATEGORIA

@api.route('/categorias/<int:categoria_id>', methods=['GET'])
def get_categoria(categoria_id):
    categoria = Categorias.query.get_or_404(categoria_id)  
    return jsonify(categoria.serialize()), 200  


# OBTENER RESTAURANTE POR SU CATEGORIA

@api.route('/categorias/<int:categoria_id>/restaurantes', methods=['GET'])
def get_restaurantes_por_categoria(categoria_id):
    restaurantes = Restaurantes.query.filter_by(categorias_id=categoria_id).all()

    if not restaurantes:
        return jsonify({"message": "No se encontraron restaurantes para esta categoría"}), 404

    return jsonify([restaurante.serialize() for restaurante in restaurantes]), 200


#CREAR RESERVA

from datetime import datetime
from api.utils import validar_horario_reserva  

@api.route('/usuario/reservas', methods=['POST'])
@jwt_required()
def crear_reserva():
    body = request.get_json()
    print(body)
    usuario_id = get_jwt_identity()
    restaurante_id = body.get('restaurante_id')
    fecha_reserva = body.get('fecha_reserva')
    adultos = body.get('adultos')
    niños = body.get('niños', 0)  
    trona = body.get('trona', 0) 
    hora= body.get('hora')

    if not all([restaurante_id, fecha_reserva, adultos]):
        return jsonify({"error": "Faltan datos para crear la reserva"}), 400

    fecha_reserva_str = fecha_reserva + ' ' + hora + ':00'
    try:
        fecha_reserva = datetime.strptime(fecha_reserva_str, '%Y-%m-%d %H:%M:%S')
    except ValueError:
        return jsonify({"error": "Formato de fecha no válido. Usa el formato YYYY-MM-DD HH:MM:SS"}), 400

    restaurante = Restaurantes.query.get(restaurante_id)
    if not restaurante:
        return jsonify({"error": "Restaurante no encontrado"}), 404

    if not validar_horario_reserva(
            fecha_reserva.time(), 
            restaurante.horario_mañana_inicio, 
            restaurante.horario_mañana_fin, 
            restaurante.horario_tarde_inicio, 
            restaurante.horario_tarde_fin):
        return jsonify({"error": "Hora de reserva fuera del horario permitido"}), 400

    nueva_reserva = Reserva(
        user_id=usuario_id,
        restaurante_id=restaurante_id,
        fecha_reserva=fecha_reserva,
        adultos=adultos,
        niños=niños,
        trona=trona
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

    if 'adultos' in body:
        reserva.adultos = body['adultos']
    if 'niños' in body:
        reserva.niños = body['niños']
    if 'trona' in body:
        reserva.trona = body['trona']
    if 'fecha_reserva' in body:
        reserva.fecha_reserva = body['fecha_reserva']

    db.session.commit()
    
    return jsonify({"message": "Reserva actualizada con éxito", "reserva": reserva.serialize()}), 200


#BORRAR RESERVA

@api.route('/reservas/<int:reserva_id>', methods=['DELETE'])
def cancelar_reserva(reserva_id):
    reserva = Reserva.query.get(reserva_id)
    if not reserva:
        return jsonify({"error": "Reserva no encontrada"}), 404

    db.session.delete(reserva)
    db.session.commit()

    return jsonify({"message": "Reserva eliminada con éxito"}), 200


#CREAR FAVORITOS

@api.route('/usuario/<int:usuario_id>/favoritos', methods=['POST'])
@jwt_required()
def agregar_favorito(usuario_id):

    body = request.json

    restaurante_id = body.get('restaurante_id')

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

@api.route('/usuario/<int:usuario_id>/favoritos/<int:restaurante_id>', methods=['DELETE'])
def eliminar_favorito(usuario_id, restaurante_id):
    

    if not all([usuario_id, restaurante_id]):
        return jsonify({"error": "Faltan datos para eliminar de favoritos"}), 400

    favorito = Restaurantes_Favoritos.query.filter_by(usuario_id=usuario_id, restaurantes_id=restaurante_id).first()

    if not favorito:
        return jsonify({"error": "El restaurante no está en favoritos"}), 404

    db.session.delete(favorito)
    db.session.commit()

    return jsonify({"message": "Restaurante eliminado de favoritos"}), 200

# ELIMINAR 1 FAVORITO DEL USUARIO

@api.route('/usuario/<int:usuario_id>/favoritos/<int:favorito_id>', methods=['DELETE'])
def eliminar_un_favorito(usuario_id, favorito_id):
    favorito = Restaurantes_Favoritos.query.filter_by(id=favorito_id, usuario_id=usuario_id).first()

    if not favorito:
        return jsonify({"msg": "Favorito no encontrado"}), 404

    db.session.delete(favorito)
    db.session.commit()

    return jsonify({"msg": "Favorito eliminado"}), 200

#OBTENER FAVORITO

@api.route('/usuario/<int:usuario_id>/favoritos', methods=['GET'])
def obtener_favoritos(usuario_id):                     

          
    usuario = Usuario.query.get(usuario_id)
    
    if not usuario:
        return jsonify({"error": "Usuario no encontrado"}), 404

    
    favoritos = Restaurantes_Favoritos.query.filter_by(usuario_id=usuario_id).all()

    
    resultado = []
    for favorito in favoritos:
        restaurante = Restaurantes.query.get(favorito.restaurantes_id)
        if restaurante:
            resultado.append({
                "restaurante_id": restaurante.id,
                "nombre": restaurante.nombre,
                "direccion": restaurante.direccion,
                "telefono": restaurante.telefono,
                "image": restaurante.image
            })

    return jsonify({"restaurantes_favoritos": resultado}), 200

#CREAR VALORACION

@api.route('/usuario/<int:user_id>/valoraciones', methods=['POST'])
def agregar_valoracion(user_id):
    body = request.get_json()

    restaurante_id = body.get('restaurante_id')
    puntuacion = body.get('puntuacion')
    comentario = body.get('comentario', "")

    if not all([user_id, restaurante_id, puntuacion]):
        return jsonify({"error": "Faltan datos para la valoración"}), 400

    valoracion_existente = Valoracion.query.filter_by(usuario_id=user_id, restaurante_id=restaurante_id).first()
    if valoracion_existente:
        return jsonify({"error": "Ya has valorado este restaurante"}), 400

    nueva_valoracion = Valoracion(
        usuario_id=user_id,
        restaurante_id=restaurante_id,
        puntuacion=puntuacion,
        comentario=comentario
    )
    
    db.session.add(nueva_valoracion)
    db.session.commit()

    return jsonify({"message": "Valoración creada con éxito", "valoracion": nueva_valoracion.serialize()}), 201

#ACTUALIZAR VALORACION

@api.route('/usuario/<int:user_id>/valoraciones', methods=['PUT'])
def actualizar_valoracion(user_id):
    body = request.get_json()

    restaurante_id = body.get('restaurante_id')
    puntuacion = body.get('puntuacion')
    comentario = body.get('comentario', "")

    if not all([user_id, restaurante_id, puntuacion]):
        return jsonify({"error": "Faltan datos para poder actualizar la valoración"}), 400

    valoracion_existente = Valoracion.query.filter_by(usuario_id=user_id, restaurante_id=restaurante_id).first()
    if not valoracion_existente:
        return jsonify({"error": "No se encontró ninguna valoración para este restaurante hecha por este usuario"}), 404

    valoracion_existente.puntuacion = puntuacion
    valoracion_existente.comentario = comentario
    db.session.commit()

    return jsonify({"message": "Valoración actualizada con éxito", "valoracion": valoracion_existente.serialize()}), 200

#BORRAR VALORACION

@api.route('/usuario/<int:user_id>/valoraciones', methods=['DELETE'])
def eliminar_valoracion(user_id):
    body = request.get_json()

    restaurante_id = body.get('restaurante_id')

    if not all([user_id, restaurante_id]):
        return jsonify({"error": "Faltan datos para  poder eliminar la valoración"}), 400

    valoracion = Valoracion.query.filter_by(usuario_id=user_id, restaurante_id=restaurante_id).first()

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



# CLOUDINARY

@api.route('/upload_image', methods=['POST'])
def upload_image():
    try:
        if 'file' not in request.files:
            return jsonify({"msg": "No se ha adjuntado ninguna imagen"}), 400

        image = request.files['file']  

        upload_result = cloudinary.uploader.upload(image)

        return jsonify({
            "msg": "Imagen subida con éxito",
            "url": upload_result['secure_url']
        }), 200

    except Exception as e:
        return jsonify({"msg": "Error subiendo la imagen", "error": str(e)}), 400
    

# RUTA PARA GUARDAR IMAGEN DEL RESTAURANTE EN EL BACKEND
@api.route('/restaurantes/<int:restaurante_id>/imagen', methods=['PUT'])
@jwt_required()  
def actualizar_imagen_restaurante(restaurante_id):
    body = request.get_json()  
    url_imagen = body.get('url_imagen')  

    if not url_imagen:
        return jsonify({'msg': 'Falta la URL de la imagen'}), 400

    restaurante = Restaurantes.query.get(restaurante_id)
    if not restaurante:
        return jsonify({'msg': 'Restaurante no encontrado'}), 404

    restaurante.image = url_imagen
    db.session.commit()

    return jsonify({'msg': 'Imagen actualizada con éxito', 'image': restaurante.image}), 200


# ELIMINAR IMAGENES
@api.route('/restaurantes/<int:restaurante_id>/imagen', methods=['DELETE'])
@jwt_required()
def eliminar_imagen_restaurante(restaurante_id):
    body = request.get_json()
    url_imagen = body.get('url_imagen')  

    if not url_imagen:
        return jsonify({'msg': 'Falta la URL de la imagen'}), 400

    restaurante = Restaurantes.query.get(restaurante_id)
    if not restaurante:
        return jsonify({'msg': 'Restaurante no encontrado'}), 404

    if restaurante.image == url_imagen:
        restaurante.image = None 
        db.session.commit()
        return jsonify({'msg': 'Imagen eliminada con éxito'}), 200
    else:
        return jsonify({'msg': 'Imagen no encontrada o no coincide'}), 404


    
#CAMBIAR CONTRASEÑA RESTAURANTE

@api.route('/restaurante/cambiar_contrasena', methods=['PUT'])
@jwt_required()
def cambiar_contrasena():
    print("hola")
    restaurante_id = get_jwt_identity()  
    data = request.get_json()

    current_password = data.get('currentPassword')
    new_password = data.get('newPassword')

    if not current_password or not new_password:
        return jsonify({"msg": "Debe proporcionar la contraseña actual y la nueva contraseña"}), 400

    restaurante = Restaurantes.query.get(restaurante_id)

    if not restaurante:
        return jsonify({"msg": "Restaurante no encontrado"}), 404

    if not check_password_hash(restaurante.password_hash, current_password):
        return jsonify({"msg": "Contraseña actual incorrecta"}), 401

    restaurante.password_hash = generate_password_hash(new_password)
    db.session.commit()

    return jsonify({"msg": "Contraseña actualizada con éxito"}), 200


# CAMBIAR CONTRASEÑA USUARIO

@api.route('/usuario/cambiar_contrasena', methods=['PUT'])
@jwt_required()
def cambiar_contrasena_usuario():
    usuario_id = get_jwt_identity()
    data = request.get_json()

    current_password = data.get('currentPassword')
    new_password = data.get('newPassword')

    if not current_password or not new_password:
        return jsonify({"msg": "Debe proporcionar la contraseña actual y la nueva contraseña"}), 400
    usuario = Usuario.query.get(usuario_id)

    if not usuario:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    if not check_password_hash(usuario.password_hash, current_password):
        return jsonify({"msg": "Contraseña actual incorrecta"}), 401

    usuario.password_hash = generate_password_hash(new_password)
    db.session.commit()

    return jsonify({"msg": "Contraseña actualizada con éxito"}), 200

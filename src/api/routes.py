"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, Usuario, Reserva
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

#CREAR RESERVA

@api.route('/usuario/reservas', methods=['POST'])
def crear_reserva():
    body = request.get_json()
    
    user_id = body.get('user_id')
    restaurante_id = body.get('restaurante_id')
    fecha_reserva = body.get('fecha_reserva')
    numero_adultos = body.get('numero_adultos')
    numero_niños = body.get('numero_niños')
    trona= body.get('trona')

    if not all([user_id, restaurante_id, fecha_reserva, numero_adultos, numero_niños, trona]):
        return jsonify({"error": "Faltan datos para crear la reserva"}), 400

    nueva_reserva = Reserva(
        user_id=user_id,
        restaurante_id=restaurante_id,
        fecha_reserva=fecha_reserva,
        numero_adultos=numero_adultos,
        numero_niños=numero_niños,
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
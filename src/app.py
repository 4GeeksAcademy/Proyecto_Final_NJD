from sqlalchemy.exc import ProgrammingError  # <-- Línea añadida para manejar el error si las tablas no están listas

"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger

from flask_jwt_extended import JWTManager
from datetime import timedelta
from flask_cors import CORS  # <-- Importar CORS
#API Email:
from flask_mail import Mail, Message

#Cloudinary:
import cloudinary
import cloudinary.uploader
import cloudinary.api

from api.utils import APIException, generate_sitemap
from api.models import db
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands

# HARDCODE PARA METER LAS CATEGORIAS Y RESTAURANTES EN CADA RESET / SOLO PARA PRUEBAS
from api.setup_categorias import cargar_categorias_iniciales
from api.setup_restaurantes import cargar_restaurantes_iniciales  # <-- Añadido para cargar restaurantes también

# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
app.url_map.strict_slashes = False

CORS(app)  # <-- Aquí habilitas CORS para todas las rutas

# Instancia de Mail API email
mail = Mail()

#API email
# Configuración de Flask-Mail
app.config.update(dict(
    DEBUG=False,
    MAIL_SERVER='smtp.gmail.com',
    MAIL_PORT=587,
    MAIL_USE_TLS=True,
    MAIL_USE_SSL=False,
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),  # esto en .env
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD")   # esto en .env
))

# Inicio Mail
mail.init_app(app)

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'nelvb'  # Clave secreta para JWT
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)  # El token expira en 24 horas

# Inicializar la base de datos y realizar migraciones
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# CARGAR CATEGORIAS Y RESTAURANTES INICIALES SI NO ESTÁN EN LA BASE DE DATOS / SOLO PARA PRUEBAS
with app.app_context():
    try:
        cargar_categorias_iniciales()  # <-- Cambiado para que se maneje dentro de un bloque try
        db.session.commit() 
        cargar_restaurantes_iniciales()  # <-- Añadido para cargar restaurantes después de las categorías
    except ProgrammingError:  # <-- Capturar el error si las tablas no están listas
        print("No se pueden cargar los datos iniciales porque las tablas no están listas.")  # <-- Mensaje de error

# Inicializar JWTManager
jwt = JWTManager(app)

# Configuración de Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints
@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response

# Endpoint de prueba para enviar correo
@app.route('/send-mail', methods=['POST'])
def send_mail():
    data = request.json
    user_email = data.get('email')  # Email del usuario que hizo la reserva
    restaurant_name = data.get('restaurant_name')  # Nombre del restaurante
    reservation_date = data.get('reservation_date')  # Fecha de la reserva
    reservation_time = data.get('reservation_time')  # Hora de la reserva

    try:
        # Crear el mensaje de correo
        msg = Message(subject="Confirmación de Reserva",
                      sender=os.getenv("MAIL_USERNAME"),
                      recipients=[user_email])

        # Cuerpo del correo en HTML
        msg.html = f"""
            <h3>Confirmación de tu reserva</h3>
            <p>Gracias por reservar en <strong>{restaurant_name}</strong>.</p>
            <p>Detalles de tu reserva:</p>
            <ul>
                <li><strong>Fecha:</strong> {reservation_date}</li>
                <li><strong>Hora:</strong> {reservation_time}</li>
            </ul>
            <p>Nos vemos pronto!</p>
        """

        # Enviar el correo
        mail.send(msg)

        return jsonify({"message": "Correo enviado exitosamente"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)

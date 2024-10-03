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




MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

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

#API email/Enpoint para que maneje el envío del correo de confirmación de reserva
# Imports (ya presentes en tu app.py)
import os
from flask import Flask, request, jsonify, send_from_directory
from flask_mail import Mail, Message
from api.models import db
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from datetime import timedelta
from flask_cors import CORS

# Configuración de la app
app = Flask(__name__)
CORS(app)  # Habilitar CORS
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'nelvb'  # Clave secreta para JWT
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

# Configuración del correo electrónico
app.config.update(dict(
    DEBUG=False,
    MAIL_SERVER='smtp.gmail.com',
    MAIL_PORT=587,
    MAIL_USE_TLS=True,
    MAIL_USE_SSL=False,
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),  # Asegúrate de tener esto en tu .env
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD")   # Asegúrate de tener esto en tu .env
))

mail = Mail(app)  # Inicializar extensión de Flask para manejar emails

# Inicialización de la base de datos y migraciones
db.init_app(app)
MIGRATE = Migrate(app, db)

# Inicialización de JWT
jwt = JWTManager(app)

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

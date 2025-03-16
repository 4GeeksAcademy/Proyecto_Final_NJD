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
from flask_cors import CORS  
from flask_mail import Mail, Message
import cloudinary
import cloudinary.uploader
import cloudinary.api

from api.utils import APIException, generate_sitemap
from api.models import db
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from api.setup_categorias import cargar_categorias_iniciales
from api.setup_restaurantes import cargar_restaurantes_iniciales  

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
app.url_map.strict_slashes = False

CORS(app)  

# Instancia de Mail API email
mail = Mail()

# Configuración de Flask-Mail
app.config.update(dict(
    DEBUG=False,
    MAIL_SERVER='smtp.gmail.com',
    MAIL_PORT=587,
    MAIL_USE_TLS=True,
    MAIL_USE_SSL=False,
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),  
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),  
    MAIL_DEFAULT_SENDER = 'hoynococino.ceo@gmail.com'
))

mail.init_app(app)

# Configuración de la base de datos
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'nelvb' 
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)  

MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

with app.app_context():
    try:
        cargar_categorias_iniciales()
        db.session.commit()  
        cargar_restaurantes_iniciales()
    except ProgrammingError:
        print("No se pueden cargar los datos iniciales porque las tablas no están listas.")  

jwt = JWTManager(app)

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

setup_admin(app)
setup_commands(app)
app.register_blueprint(api, url_prefix='/api')

@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  
    return response

@app.route('/send-mail', methods=['POST'])
def send_mail():
    data = request.json
    user_email = data.get('email')  
    restaurant_name = data.get('restaurant_name')  
    reservation_date = data.get('reservation_date')  
    reservation_time = data.get('reservation_time')  

    try:
        msg = Message(subject="Confirmación de Reserva",
                      sender=os.getenv("MAIL_USERNAME"),
                      recipients=[user_email])

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

        mail.send(msg)
        return jsonify({"message": "Correo enviado exitosamente"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)

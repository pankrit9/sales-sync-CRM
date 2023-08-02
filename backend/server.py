import json
import datetime
import jwt
from flask import Flask, render_template, request, flash, jsonify, session
from flask_cors import CORS
from functools import wraps
from config import db, bcrypt
from auth.auth_routes import auth
from tasks.tasks_routes import tasks
from products.products_routes import products
from sales.records_routes import records
from clients.clients_routes import clients
from sales.sales_routes import sales
import certifi
from dotenv import load_dotenv
import os   # access to env variables using os.getenv
from chatbot.chatbot_routes import chatbot, setupChatbot

def create_app():
    os.environ["OPENAI_API_KEY"] = "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"

    load_dotenv()

    # app = Flask(__name__)
    # CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
    app = Flask(__name__)
    app.config['CORS_HEADERS'] = 'Content-Type'

    CORS(app, origins="http://localhost:3000", supports_credentials=True)  # Specify exact origin

    # loading the .env file and getting the keys
    # HUGGING_FACE_API_KEY = os.getenv("HUGGINGFACEHUB_API_TOKEN")

    app.config['SECRET_KEY'] = 'Avengers'
    SECRET_JWT = 'salesync'

    bcrypt.init_app(app)

    # Blueprints
    print("\nserver running...\n")
    app.register_blueprint(auth, url_prefix="/auth")
    app.register_blueprint(products, url_prefix="/products")
    app.register_blueprint(records, url_prefix="/records")
    app.register_blueprint(tasks, url_prefix="/tasks")
    app.register_blueprint(sales, url_prefix="/sales")
    app.register_blueprint(clients, url_prefix="/clients")
    app.register_blueprint(chatbot, url_prefix="/chatbot")

    # This might be usefull later on
    def token_required(f):
        '''
        This is going to be the wrapper function that will called before accessing any route 
        that requires authentication.
        '''
        @wraps(f)
        def decorated(*args, **kwargs):
            token = request.args.get('token')

            if not token:
                return jsonify({'message': 'Token not found'}), 403

            try:
                data = jwt.decode(token, app.config['SECRET_KEY'])
            except:
                return jsonify({'message': 'Token is invalid'}), 401
            
            return f(data, *args, **kwargs)
        return decorated

    # setup chatbot
    with app.app_context():
        setupChatbot()

    return app

# @app.route("/", methods=['GET'])
# def home():
#     return "Hello World!"

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
# RECOMMENDATION if production env: Flask application should be run using a production-grade WSGI server such as Gunicorn or uWSGI
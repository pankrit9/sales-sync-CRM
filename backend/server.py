import jwt
from flask import Flask, render_template, request, flash, jsonify, session
from flask_cors import CORS
from functools import wraps
from config import db, bcrypt
from routes.auth_routes import auth
from routes.tasks_routes import tasks
from routes.products_routes import products
from routes.records_routes import records
from routes.clients_routes import clients
from routes.sales_routes import sales
from routes.gamification_routes import rankings
import certifi
from dotenv import load_dotenv
import os   # access to env variables using os.getenv
from routes.chatbot_routes import chatbot, setupChatbot

def create_app(host='0.0.0.0', port=6969):
    os.environ["OPENAI_API_KEY"] = "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"

    load_dotenv()

    # app = Flask(__name__)
    # CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
    app = Flask(__name__)
    app.config['CORS_HEADERS'] = 'Content-Type'

    CORS(app, origins="https://sales-sync-crm-frontend.vercel.app", supports_credentials=True)  # Specify exact origin

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
    app.register_blueprint(rankings, url_prefix="/rankings")

    # setup chatbot
    with app.app_context():
        setupChatbot()
    # app.run(host=host, port=port, debug=True)
    app.run(ssl_context=('cert.pem', 'key.pem'), port=6969)
    return app

# @app.route("/", methods=['GET'])
# def home():
#     return "Hello World! Welcome to the sales sync crm's backend!"

if __name__ == '__main__':
    app = create_app('0.0.0.0',6969)
import certifi
import json
import datetime
import jwt
from flask import Flask, render_template, request, flash, jsonify, session
from functools import wraps
from config import db, bcrypt
from flask_cors import CORS
from auth.auth_routes import auth
from tasks.tasks_routes import manTasks, staTasks
from products.products_routes import products
from sales.sales_route import records
import certifi


app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'Avengers'

SECRET_JWT = 'salesync'

bcrypt.init_app(app)

# Blueprints
app.register_blueprint(auth, url_prefix="/auth")
app.register_blueprint(manTasks, url_prefix="/manager/tasks")
app.register_blueprint(staTasks, url_prefix="/staff/tasks")
app.register_blueprint(products, url_prefix="/products")
app.register_blueprint(records, url_prefix="/records")

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


@app.route("/", methods=['GET'])
def home():
    return




if __name__ == '__main__':
    app.run(debug=True)

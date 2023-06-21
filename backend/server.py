import json
import datetime
import jwt
from flask import Flask, render_template, request, flash, jsonify, session
from functools import wraps
from config import db, bcrypt
from flask_cors import CORS
from auth.auth_routes import auth


app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'Avengers'

SECRET_JWT = 'salesync'



bcrypt.init_app(app)

# Blueprints
app.register_blueprint(auth, url_prefix="/auth")

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



'''@app.route("/add-product", methods = ['POST'])
def add_products():
    products = db.Products

    new_product = {
        "name" : request.json['name'],
        "stock" : request.json['stock'] ,
        "price" : request.json['price']
    }

    products.insert_one(new_product)

    return jsonify({"product_list": []})'''

@app.route("/users", methods=['GET'])
#@token_required
def staff_list(data):
    users_cursor = db.Accounts.find()
    users_list = [user for user in users_cursor]
    return jsonify({

    })


if __name__ == '__main__':
    app.run(debug=True)

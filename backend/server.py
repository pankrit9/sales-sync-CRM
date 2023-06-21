import json
import datetime
import jwt
from flask import Flask, render_template, request, flash, jsonify, session
from functools import wraps
from pymongo import MongoClient
from flask_cors import CORS
from flask_bcrypt import Bcrypt

from loginRegister.registerLoginHelpers import check_email_password, recovery_email

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'Avengers'

SECRET_JWT = 'salesync'

# Blueprints
#app.register_blueprint(login_page, url_prefix="/login")

# db is the CRM database
database_URL = "mongodb+srv://avengers:endgame@crm.e8aut5k.mongodb.net/"
client = MongoClient(database_URL)

db = client.CRM

# bcrypt is going to be used for password encryption
# https://www.geeksforgeeks.org/password-hashing-with-bcrypt-in-flask/
bcrypt = Bcrypt(app)


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


@app.route("/auth/login", methods=['GET', 'POST'])
def login():

    # find user with the given email
    matching_user = db.Accounts.find_one({"email": request.json['email']})
    print(matching_user)
    if bcrypt.check_password_hash(matching_user['password'], request.json['password']):        
        # Created a token so users can be authenticated
        token = jwt.encode({
            'email': request.json['email'],
            'first_name': matching_user['first_name'],
            #'position': matching_user['position'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=180)
        }, app.config['SECRET_KEY'])  # Secret key is 'Avengers'

        # return token for the session
        return jsonify({'token': token})


@app.route("/auth/register", methods=['POST'])
def register():

    # Encrypt the password
    encoded_password = bcrypt.generate_password_hash(
        request.form['password']).decode('utf-8')

    # Create a temporary user that will be added to the mongodb
    new_user = {
        "email": request.form['email'],
        "first_name": request.form['firstName'],
        "last_name": request.form['lastName'],
        "password": encoded_password,
        #"position": request.form['position'],
        "company": request.form['company']
    }

    # Check whether the email is taken
    if db.Accounts.find_one({"email": new_user['email']}):
        return jsonify({"error": "The given email is already taken."})

    check_email_password(request.form['email'],request.form['password'])
    # Adds user to the database
    db.Accounts.insert_one(new_user)

    # Returns the success message, Should return token
    return jsonify({"message": "User was succesfuly created."})

@app.route("/auth/recover-password", methods=['GET', 'POST'])
def recover_password():

    # get user with the given email from the database
    matching_user = db.Accounts.find_one({"email": request.json['email']})
    # Send code to email and get the sent code
    recovery_code = recovery_email(request.json['email'], bcrypt)
    print(recovery_code)
    # Add an key-value pair that stores an encrypted code.
    db.Accounts.update_one( {"email": request.json['email']},{ "$set": { "reset_code": recovery_code}})

    return jsonify({"message": "A code for changing your password have been sent to the given email."})

@app.route("/auth/change-password", methods=['GET', 'POST'])
def change_password():

    # get user with the given email from the database
    matching_user = db.Accounts.find_one({"email": request.json['email']})
    # Verify the code
    bcrypt.check_password_hash(matching_user["reset_code"],request.json['code'])
    if bcrypt.check_password_hash(matching_user["reset_code"],request.json['code']):        
        # update the password for the given email
        db.Accounts.update_one( 
            { "email": request.json['email']},
            { "$set": { "password": request.json['new_password']}})

        return jsonify({'message': "success"})

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

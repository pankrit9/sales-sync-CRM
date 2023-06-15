from flask import Flask , render_template, request, flash, jsonify
import jwt
from functools import wraps
from pymongo import MongoClient
#from src.error import InputError, AccessError
from helpers import add_customer
import datetime

from flask_bcrypt import Bcrypt
from registerLoginHelpers import check_email_taken

app = Flask(__name__)
app.config['SECRET_KEY'] = 'Avengers'

database_URL = "mongodb+srv://avengers:endgame@crm.e8aut5k.mongodb.net/"
client = MongoClient(database_URL)
SECRET_JWT = 'salesync'

# db is the CRM database
db = client.CRM

# bcrypt is going to be used for password encryption
# https://www.geeksforgeeks.org/password-hashing-with-bcrypt-in-flask/
bcrypt = Bcrypt(app)

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
    return decorated



@app.route("/" , methods=['GET'])
def home():
    return render_template("home.html")


@app.route("/login" , methods=['GET','POST'])
def login():
    request.form['email']
    if request.form['email'] and db.Accounts.find_one({"email": request.form['email']}):
        token = jwt.encode({
            'user': request.form['email'],
            'exp' : datetime.datetime.utcnow() + datetime.timedelta(seconds=180)
        }, app.config['SECRET_KEY']) #Secret key is 'Avengers'

        return jsonify({'token': token.decode('utf-8')})
    else:
        pass
        


@app.route("/register", methods=['POST'])
def register():
    encoded_password = bcrypt.generate_password_hash(request.json['password']).decode('utf-8')

    new_user = { 
        "email" : request.json['email'],
        "first_name" : request.json['first_name'],
        "last_name" : request.json['last_name'],
        "password" : encoded_password,
        "position" : request.json['position'],
        "company" : request.json['company']
    }
    # Check whether the email is taken
    if db.Accounts.find_one({"email": new_user['email']}):
        return jsonify({"error": "The given email is already taken."})
    
    # Adds user to the database
    db.Accounts.insert_one(new_user)
    return jsonify({"msg" :"User was succesfuly created."})

@app.route("/users", methods=['GET'])
@token_required
def staff_list():
    
    return db.Accounts.find({})

if __name__ == '__main__':
    app.run(debug=True)
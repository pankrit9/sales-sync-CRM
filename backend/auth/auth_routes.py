import datetime
import jwt
from config import db, bcrypt
from flask import Blueprint, jsonify, request
from auth.registerLoginHelpers import check_email_password, recovery_email

# All the api requests that start with auth will be guided here
# so if someone request auth/login then it direct them to this file and then
# search for the route /login
auth = Blueprint('auth', __name__)


@auth.route("/login", methods=['GET', 'POST'])
def login():

    # find user with the given email
    matching_user = db.Accounts.find_one({"email": request.json['email']})

    if bcrypt.check_password_hash(matching_user['password'], request.json['password']):        
        # Created a token so users can be authenticated
        token = jwt.encode({
            'email': request.json['email'],
            'first_name': matching_user['first_name'],
            #'position': matching_user['position'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=180)
        }, 'Avengers')  # Secret key is 'Avengers'

        # return token for the session
        return jsonify({'token': token})


@auth.route("/register", methods=['POST'])
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


@auth.route("/recover-password", methods=['GET', 'POST'])
def recover_password():

    # get user with the given email from the database
    matching_user = db.Accounts.find_one({"email": request.json['email']})

    # Send code to email and get the sent code
    recovery_code = recovery_email(request.json['email'], bcrypt)
    
    # Add an key-value pair that stores an encrypted code.
    db.Accounts.update_one( {"email": request.json['email']},{ "$set": { "reset_code": recovery_code}})

    return jsonify({"message": "A code for changing your password have been sent to the given email."})


@auth.route("/change-password", methods=['GET', 'POST'])
def change_password():

    # get user with the given email from the database
    matching_user = db.Accounts.find_one({"email": request.json['email']})

    # Verify the code
    if bcrypt.check_password_hash(matching_user["reset_code"],request.json['code']):        
        # update the password for the given email
        db.Accounts.update_one( 
            { "email": request.json['email']},
            { "$set": { "password": request.json['new_password']}})

        return jsonify({'message': "success"})

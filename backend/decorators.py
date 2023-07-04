from functools import wraps
from flask import app, request, jsonify
import jwt
from config import db


def manager_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        data = jwt.decode(token, app.config['SECRET_KEY'])
        if data['role'] != 'manager':
            return jsonify({'message': 'Manager Role Required'}), 403
        return f(*args, **kwargs)
    return decorated

# for authorization
def token_required(f):
    '''
    This is going to be the wrapper function that will called before accessing any route 
    that requires authentication.
    '''
    @wraps(f)
    def decorated(*args, **kwargs):
        print("decorator called ... ")
        token = request.args.get('token')

        if not token:
            print("token is missing ... ")
            return jsonify({'message': 'Token not found'}), 403
        
        try:
            print("token is being decoded ... ")
            data = jwt.decode(token, app.config['SECRET_KEY'])
            current_user_email = db.Accounts.find_one({"email": data['email']})
            current_user = str(current_user_email['_id'])
        except:
            print("token is invalid ... ")
            return jsonify({'message': 'Token is invalid'}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated



def jwt_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        print("decorator called ... ")
        token = None

        if 'x-access-token' in request.headers: # assuming your token is in header
            token = request.headers['x-access-token']
        
        if not token:
            print("token is missing ... ")
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            print("token is being decoded ... ")
            data = jwt.decode(token, 'Avengers')
            current_user = db.Accounts.find_one({"email": data['email']})
        except:
            print("token is invalid ... ")
            return jsonify({'message': 'Token is invalid!'}), 401
        
        return f(current_user, *args, **kwargs)

    return decorated


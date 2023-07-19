from datetime import datetime, timedelta
import jwt
from config import db, bcrypt
from flask import Blueprint, jsonify, request, session
from auth.registerLoginHelpers import check_email_password, recovery_email

# All the api requests that start with auth will be guided here
# so if someone request auth/login then it direct them to this file and then
# search for the route /login
auth = Blueprint('auth', __name__)


@auth.route("/login", methods=['POST'])
def login():
    token = ""
    # find user with the given email
    matching_user = db.Accounts.find_one({"email": request.json['email']})
    
    if matching_user is None:
        return jsonify({"message": "User not found"}), 404
    
    if bcrypt.check_password_hash(matching_user['password'], request.json['password']):        
        # Created a token so users can be authenticated
        token = jwt.encode({
            'user_id': str(matching_user['_id']),
            'email': request.json['email'],
            'first_name': matching_user['first_name'],
            'company': matching_user['company'],
            'role': matching_user['role'],
            'exp': datetime.utcnow() + timedelta(seconds=180)
        }, 'Avengers')  # Secret key is 'Avengers'
        session["logged_in"] = True

        # return token for the session
        return jsonify({"message": "Login successful", "token": token})
    else:
        return jsonify({"message": "Incorrect details.", "token": token})
        


@auth.route("/register", methods=['POST'])
def register():

    # Encrypt the password
    encoded_password = bcrypt.generate_password_hash(
        request.form['password']).decode('utf-8')
    
    all_users_ids = [int(account['_id']) for account in db.Accounts.find({}, {"_id": 1})]

    if not all_users_ids:
        userId = 1
    else:
        max_id = max(all_users_ids)
        userId = max_id + 1

    full_name = request.form['firstName'] + " " + request.form['lastName']
    # Create a temporary user that will be added to the mongodb
    new_user = {
        "_id": str(userId),
        "email": request.form['email'],
        "first_name": request.form['firstName'],
        "last_name": request.form['lastName'],
        "full_name":full_name,
        "password": encoded_password,
        "role": request.form['role'],
        "company": request.form['company'],
        "code": request.form["code"],
        "revenue": 0,
        "tasks_n": 0
    }

    # Check whether the email is taken
    if db.Accounts.find_one({"email": new_user['email']}):
        return jsonify({"error": "The given email is already taken."}), 409

    check_email_password(request.form['email'],request.form['password'])

    #Check if company exists
    response = check_company(full_name, request.form['email'], request.form['role'], request.form['company'], request.form["code"])
    if response == "New company created" or response == "Registered in the company":
        # Adds user to the database
        db.Accounts.insert_one(new_user)
        return jsonify({"message": response}), 200
    

    # Returns the success message, Should return token
    return jsonify({"message": response}), 401


@auth.route("/recover-password", methods=['POST'])
def recover_password():

    # get user with the given email from the database
    matching_user = db.Accounts.find_one({"email": request.json['email']})

    # Send code to email and get the sent code
    recovery_code = recovery_email(request.json['email'], bcrypt)
    
    # Add an key-value pair that stores an encrypted code.
    db.Accounts.update_one( {"email": request.json['email']},{ "$set": { "reset_code": recovery_code}})

    return jsonify({"message": "A code for changing your password have been sent to the given email."})


@auth.route("/change-password", methods=['PUT'])
def change_password():

    # get user with the given email from the database
    matching_user = db.Accounts.find_one({"email": request.json['email']})

    # Verify the code
    if bcrypt.check_password_hash(matching_user["reset_code"],request.json['code']):        
        # update the password for the given email
        db.Accounts.update_one( 
            { "email": request.json['email']},
            { "$set": { "password": bcrypt.generate_password_hash(request.json['new_password']).decode('utf-8')}}
        )
        return jsonify({'message': "success"}), 200
    return jsonify({'message': "Incorrect details."}), 401


@auth.route("/", methods=['GET'])
def get_staff():
    
    staff = db.Accounts.find({'role': 'staff'})

    # convert Cursor type to list
    staff_list = list(staff)

    if not staff_list:
        return jsonify({"message": "There is no staff registered"})

    return jsonify(staff_list)

def check_company(name, email, role, company_name, code):
    '''
    Check whether the company exists. If the company exists and the company code is correct
    then join the company.
    If the company doesn't exist and the user is a manager then create a new company,
    otherwise return "Invalid company code".
    
    '''
    all_companies = [company['name'] for company in db.Companies.find({})]

    if request.form['company'] not in all_companies:
        if role == "manager":
            all_companies_id = [int(company['_id']) for company in db.Companies.find({}, {"_id": 1})]
            
            # Generate a companyId based on largest ID in collection
            if not all_companies_id:
                company_id = 1
            else:
                company_id = max(all_companies_id) + 1
            
            new_company = {
                "_id" : company_id,
                "name" : company_name,
                "code" : code, 
                "admin" : name,
                "creation_date": datetime.now()
            }
            db.Companies.insert_one(new_company)

            return "New company created"
        else: 
            return "This company doesn't exist"
    else:
        company =  db.Companies.find({"name": company_name, "code": code})
        print(company)
        if company["code"] == code:
            return "Registered in the company"
        else:
            return "Invalid company code"
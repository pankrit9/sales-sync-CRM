import datetime
import jwt
from config import db
from flask import Blueprint, jsonify, request

# All the api requests that start with auth will be guided here
# so if someone request auth/login then it direct them to this file and then
# search for the route /login
customers = Blueprint('customers', __name__)

# We have POST, PUT, DELETE and GET 
@customers.route("/add", methods = ['POST'])
def add_customer():
    customers = db.Customers

    new_customer = {
        "client" : request.json['name'],
        "lifetime_value" : 0,
        "pending_value" : 0,
        "tasks": "",
        "staff" : "",
        "email" : request.json['email'],
        "lead_source" : request.json['lead_source'],
        "client_position":  request.json['client_position'],
        "mobile_number" :  request.json['mobile_number'],
        "address" : request.json['address']
    }

    customers.insert_one(new_customer)

    return jsonify({"message": "success"})

# We have POST, PUT, DELETE and GET 
@customers.route("/delete", methods = ['DELETE'])
def delete_customer():
    customers = db.Customers

    delete_customer = {
        "name" : request.json['name']
    }

    customers.delete_one(delete_customer)

    return jsonify({"message": "success customer deleted"})

@customers.route("/edit/<id>", methods=['POST'])
def customer_edit(id):

    # parse json object for data to update i.e. due date
    edit = request.get_json()

    result = db.Customers.find_one({"_id":id})

 # updates fields according to provided JSON
    result = db.Customers.update_one({"_id": id}, {"$set": edit})

    if result.modified_count > 0:
        return jsonify({"message": "Successful"})
    else:
        return jsonify({"message": "Unsuccessful"}), 400 


import datetime
import jwt
from config import db
from flask import Blueprint, jsonify, request

# All the api requests that start with auth will be guided here
# so if someone request auth/login then it direct them to this file and then
# search for the route /login
clients = Blueprint('clients', __name__)

# We have POST, PUT, DELETE and GET 
@clients.route("/add", methods = ['POST'])
def add_client():
    clients = db.Clients
    all_ids = [int(clients['_id']) for clients in db.Clients.find({}, {"_id": 1})]
    
    # Generate a taskId based on largest ID in collection
    if not all_ids:
        clientId = 1
    else:
        max_id = max(all_ids)
        clientId = max_id + 1

    new_client = {
        "_id" : clientId,
        "client" : request.json['client'],
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

    clients.insert_one(new_client)

    return jsonify({"message": "success"})

# We have POST, PUT, DELETE and GET 
@clients.route("/delete", methods = ['DELETE'])
def delete_client():
    clients = db.Clients

    delete_client = {
        "name" : request.json['name']
    }

    clients.delete_one(delete_client)

    return jsonify({"message": "success client deleted"})

@clients.route("/edit/<id>", methods=['POST'])
def client_edit(id):

    # parse json object for data to update i.e. due date
    edit = request.get_json()

    result = db.Clients.find_one({"_id":id})

 # updates fields according to provided JSON
    result = db.Clients.update_one({"_id": id}, {"$set": edit})

    if result.modified_count > 0:
        return jsonify({"message": "Successful"})
    else:
        return jsonify({"message": "Unsuccessful"}), 400 

@clients.route("/", methods=['GET'])
def see_clients():
    
    all_clients = db.Clients.find({})

    # convert Cursor type to list
    client_list = list(all_clients)

    if not client_list:
        return jsonify({"message": "You don't have any clients"})

    return jsonify(client_list)
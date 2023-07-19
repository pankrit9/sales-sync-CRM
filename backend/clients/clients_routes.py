from datetime import datetime
import jwt
from config import db
from flask import Blueprint, jsonify, request

# All the api requests that start with auth will be guided here
# so if someone request auth/login then it direct them to this file and then
# search for the route /login
clients = Blueprint('clients', __name__)



# We have POST, PUT, DELETE and GET 
@clients.route("/add", methods = ['POST'])
def add_client(id):
    clients = db.Clients
    
    # Fetch all ids and convert them to integers
    all_client_ids = [int(client['_id']) for client in db.Clients.find({}, {"_id": 1})]
    
    # Generate a taskId based on largest ID in collection
    if not all_client_ids:
        client_id = 1
    else:
        max_id = max(all_client_ids)
        client_id = max_id + 1

    new_client = {
        "_id": client_id,
        "client": request.json['client'],
        "lifetime_value" : 0,
        "pending_value" : 0,
        "tasks_records": [],
        "staff" : "",
        "email" : request.json['email'],
        "lead_source" : request.json['lead_source'],
        "client_position":  request.json['client_position'],
        "mobile_number" :  request.json['mobile_number'],
        "address" : request.json['address'],
        "last_sale": "",
        "creation_date": datetime.now().strftime("%Y-%m-%d")
    }

    clients.insert_one(new_client)

    return jsonify({"message": "success"})

# We have POST, PUT, DELETE and GET 
@clients.route("/delete", methods = ['DELETE'])
def delete_client():
    
    all_clients = db.Clients.find({})

    # convert Cursor type to list
    client_list = list(all_clients)

    if not client_list:
        return jsonify({"message": "You don't have any clients"})

    return jsonify(client_list)


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

@clients.route("/history/<id>", methods=['GET'])
def see_client_history(id):
    print(id)
    found_client = db.Clients.find_one({"_id":int(id)})
    # convert Cursor type to list
    records_list = found_client["tasks_records"]

    if not records_list:
        return jsonify({"message": "There was no interaction with the client."})

    return jsonify(records_list)

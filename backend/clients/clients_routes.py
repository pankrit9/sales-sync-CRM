from datetime import datetime
from config import db
from flask import Blueprint, jsonify, request

# All the api requests that start with auth will be guided here
# so if someone request auth/login then it direct them to this file and then
# search for the route /login
clients = Blueprint('clients', __name__)

@clients.route("/add/<id>", methods = ['POST'])
def add_client(id):  
    if (db.Accounts.find_one({"_id": id}))['role'] == "manager":
        name = (db.Accounts.find_one({"_id": id}))['full_name']
    else:
        manager_id = (db.Accounts.find_one({"_id": id}))['manager']
        name = db.Accounts.find_one({"_id": manager_id})['full_name']

    # Fetch all ids and generate a taskId based on largest ID in collection
    all_client_ids = [int(client['_id']) for client in db.Clients.find({}, {"_id": 1})]
    if not all_client_ids:
        client_id = 1
    else:
        max_id = max(all_client_ids)
        client_id = max_id + 1

    # Create and insert new client
    new_client = {
        "_id": client_id,
        "client": request.json['client'],
        "lifetime_value" : 0,
        "pending_value" : 0,
        "tasks_records": [],
        "staff" : "",
        "manager_assigned": name,
        "email" : request.json['email'],
        "lead_source" : request.json['lead_source'],
        "client_position":  request.json['client_position'],
        "mobile_number" :  request.json['mobile_number'],
        "address" : request.json['address'],
        "last_sale": "",
        "creation_date": datetime.now()
    }
    db.Clients.insert_one(new_client)
    return jsonify({"message": "success"}), 200

@clients.route("/delete", methods = ['DELETE'])
def delete_client():
    # Get all clients in collection
    all_clients = db.Clients.find({})
    client_list = list(all_clients)

    # Return error if no clients, else return list
    if not client_list:
        return jsonify({"message": "You don't have any clients"}), 404
    return jsonify(client_list), 200

@clients.route("/edit/<id>", methods=['POST'])
def client_edit(id):
    # Get request data, and updates fields according to request
    edit = request.get_json()
    result = db.Clients.update_one({"_id": id}, {"$set": edit})

    if result.modified_count > 0:
        return jsonify({"message": "Successful"}), 200
    else:
        return jsonify({"message": "Error editing product"}), 400 

@clients.route("/<id>", methods=['GET'])
def see_clients(id):
    if (db.Accounts.find_one({"_id": id}))['role'] == "manager":
        name = (db.Accounts.find_one({"_id": id}))['full_name']
    else:
        manager_id = (db.Accounts.find_one({"_id": id}))['manager']
        name = db.Accounts.find_one({"_id": manager_id})['full_name']

    # Get all clients in collection
    all_clients = db.Clients.find({"manager_assigned": name})
    client_list = list(all_clients)

    # Return error if no clients, else return list
    if not client_list:
        return jsonify({"message": "You don't have any clients"}), 404
    return jsonify(client_list), 200

@clients.route("/history/<id>", methods=['GET'])
def see_client_history(id):
    # Get client based on provided id
    found_client = db.Clients.find_one({"_id":int(id)})
    records_list = found_client["tasks_records"]

    # if client doesn't exist, return empt
    # else return all task recordds associated with that client
    if not records_list:
        return jsonify([]), 200
    return jsonify(records_list), 200

import datetime
import jwt
from config import db
from flask import Blueprint, jsonify, request

# All the api requests that start with auth will be guided here
# so if someone request auth/login then it direct them to this file and then
# search for the route /login
records = Blueprint('records', __name__)

@records.route("/", methods=['GET'])
def see_records():
    
    all_records = db.Sales.find({})

    # convert Cursor type to list
    records_list = list(all_records)

    if not records_list:
        return jsonify({"message": "You don't have any records"})

    return jsonify(records_list)

@records.route("/download", methods=['GET'])
def records_download():

    all_records = db.Sales.find({})

    # convert Cursor type to list
    records_list = list(all_records)
    
    return jsonify({"message": "Unsuccessful"}), 400 
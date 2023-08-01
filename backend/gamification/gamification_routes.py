"""""
from config import db
from flask import Blueprint, jsonify, request

# All the api requests that start with auth will be guided here
# so if someone request auth/login then it direct them to this file and then
# search for the route /login
rankings = Blueprint('rankings', __name__)

@rankings.route("/<id>", methods = ['GET'])
def get_rankings(id):
    curr_user = db.Accounts.find_one({"_id": id})
    if curr_user["role"] == "manager":
        query = "manager_assigned"
    elif curr_user["role"] == "staff":
        query = "staff_member_assigned"
    else:
        return jsonify({"message": "Invalid role"}), 400
    
"""
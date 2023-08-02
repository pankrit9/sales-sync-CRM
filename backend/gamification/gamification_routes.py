from config import db
from flask import Blueprint, jsonify, request

# All the api requests that start with auth will be guided here
# so if someone request auth/login then it direct them to this file and then
# search for the route /login
rankings = Blueprint('rankings', __name__)

@rankings.route("/higher/<id>", methods = ['GET'])
def get_above_ranking(id):
    curr_user = db.Accounts.find_one({"_id": id})
    curr_user_rev = curr_user['revenue']
    if curr_user["role"] == "manager":
        company = db.Accounts.find_one({"_id": id})['code']
        higher_user_cursor = db.Accounts.find({
            "role": "manager", 
            "code": company, 
            "revenue": {"$gt": curr_user_rev}}).sort("revenue", 1).limit(1)
    elif curr_user["role"] == "staff":
        team = db.Accounts.find_one({"_id": id})['manager']
        higher_user_cursor = db.Accounts.find({
            "role": "staff", 
            "manager": team, 
            "revenue": {"$gt": curr_user_rev}}).sort("revenue", 1).limit(1)
    else:
        return jsonify({"message": "Invalid role"}), 400
    
    try:
        higher_user = next(higher_user_cursor)
    except StopIteration:
        return jsonify({}), 200
    print(higher_user)
    return jsonify(higher_user), 200

@rankings.route("/lower/<id>", methods = ['GET'])
def get_below_ranking(id):
    curr_user = db.Accounts.find_one({"_id": id})
    curr_user_rev = curr_user['revenue']
    if curr_user["role"] == "manager":
        company = db.Accounts.find_one({"_id": id})['code']
        lower_user_cursor = db.Accounts.find({
            "role": "manager",
            "code": company,
            "revenue": {"$lt": curr_user_rev}}).sort("revenue", -1).limit(1)
    elif curr_user["role"] == "staff":
        team = db.Accounts.find_one({"_id": id})['manager']
        lower_user_cursor = db.Accounts.find({
            "role": "staff",
            "manager": team,
            "revenue": {"$lt": curr_user_rev}}).sort("revenue", -1).limit(1)
    else:
        return jsonify({"message": "Invalid role"}), 400
    try:
        lower_user = next(lower_user_cursor)
    except StopIteration:
        return jsonify({}), 200
    print(lower_user)
    return jsonify(lower_user), 200
    
@rankings.route("/current/<id>", methods = ['GET'])
def get_current_ranking(id):
    return jsonify(db.Accounts.find_one({"_id": id}))
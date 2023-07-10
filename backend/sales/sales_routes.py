import datetime
import jwt
from config import db
from flask import Blueprint, jsonify, request
#from decorators import jwt_required, manager_required, token_required

sales = Blueprint('sales', __name__)

@sales.route("/tasks", methods = ['GET'])
def get_task_count():
    task_count = db.Tasks.count_documents({})
    return jsonify(task_count)

@sales.route("/revenue", methods = ['GET'])
def get_revenue_sum():
    sales = db.Sales.find({})
    
    revenue_sum = 0

    for sale in sales:
        revenue_sum += sale['revenue']

    return jsonify(revenue_sum)

@sales.route("/ltv", methods = ['GET'])
def get_ltv():

    sales = db.Sales.find({})
    
    revenue_sum = 0
    n_purchases = 0

    for sale in sales:
        revenue_sum += sale['revenue']
        n_purchases += 1

    n_client = db.Clients.count_documents({})

    # Average Purchase Value
    apv = revenue_sum / n_purchases
    # Purchase frequency
    pf = n_purchases / n_client
    # Average customer lifespan - Note, this is hardcoded for now
    acl = 1 / 0.2 
    
    ltv = apv * pf * acl

    return jsonify(ltv)

@sales.route("/clients", methods = ['GET'])
def get_client_count():
    client_count = db.Clients.count_documents({})
    return jsonify(client_count)

@sales.route("/winrate", methods = ['GET'])
def get_win_rate():
    n_clients_with_sale = db.Clients.count_documents({'last_sale': {'$exists': True, '$ne': ''}})
    n_clients = db.Clients.count_documents({})
    win_rate = n_clients_with_sale / n_clients

    return jsonify(win_rate)


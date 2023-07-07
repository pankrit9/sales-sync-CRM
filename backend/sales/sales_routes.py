import datetime
import jwt
from config import db
from flask import Blueprint, jsonify, request
from decorators import jwt_required, manager_required, token_required

sales = Blueprint('sales', __name__)

@sales.route("/tasks", methods = ['GET'])
def get_task_count():
    task_count = db.Tasks.count_documents({})
    return jsonify(task_count)

@sales.route("/revenue", methods = ['GET'])
def get_revenue_sum():
    products = db.Products.find({})
    
    revenue_sum = 0

    for product in products:
        if 'revenue' in product and isinstance(product['revenue'], str):
            revenue_sum += int(product['revenue'])

    return jsonify(revenue_sum)

#@sales.route("/clients", methods = ['GET'])
#def get_client_count():
#    client_count = db.Clients.count_documents({})
#    return jsonify(client_count)


import datetime
import jwt
from config import db
from flask import Blueprint, jsonify, request

# All the api requests that start with auth will be guided here
# so if someone request auth/login then it direct them to this file and then
# search for the route /login
products = Blueprint('products', __name__)

# We have POST, PUT, DELETE and GET 
@products.route("/add", methods = ['POST'])
def add_products():
    products = db.Products

    new_product = {
        "name" : request.json['name'],
        "stock" : request.json['stock'],
        "price" : request.json['price'],
        "n_sold": 0,
        "revenue" : 0
    }

    products.insert_one(new_product)

    return jsonify({"message": "success"})

# We have POST, PUT, DELETE and GET 
@products.route("/delete", methods = ['DELETE'])
def delete_product():
    products = db.Products

    delete_product = {
        "name" : request.json['name']
    }

    products.delete_one(delete_product)

    return jsonify({"message": "success product deleted"})

@products.route("/sell", methods = ['PUT'])
def sell_product():
    products = db.Products

    sell_product = {
        "name" : request.json['name']
    }
    quantity_sold = request.json['quantity']
    
    sold_product = products.find_one(sell_product)
    
    stock = sold_product['stock']
    price = sold_product['price']
    prev_revenue = sold_product['revenue']

    if quantity_sold > stock:
        raise Exception("You don't have enough stock available.")
    
    products.update_one(
        sell_product,
        { "$set": {"stock" : stock - quantity_sold, "revenue" : prev_revenue +price * quantity_sold}}
    )

    return jsonify({"message": "success product deleted"})


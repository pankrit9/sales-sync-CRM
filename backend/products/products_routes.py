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

    # Fetch all ids and convert them to integers
    all_prod_ids = [int(products['_id']) for products in db.Products.find({}, {"_id": 1})]
    
    # Generate a taskId based on largest ID in collection
    if not all_prod_ids:
        prodId = 1
    else:
        max_id = max(all_prod_ids)
        prodId = max_id + 1

    new_product = {
        "_id": str(prodId),
        "name" : request.json['name'],
        "stock" : request.json['stock'],
        "price" : request.json['price'],
        "n_sold": 0,
        "revenue" : 0
    }

    products.insert_one(new_product)

    return jsonify({"message": "success"})

# We have POST, PUT, DELETE and GET 
@products.route("/delete/<id>", methods = ['DELETE'])
def delete_product(id):
    products = db.Products

    products.delete_one({"_id":id})

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

@products.route("/", methods=['GET'])
def see_products():
    
    all_products = db.Products.find({})

    # convert Cursor type to list
    product_list = list(all_products)

    if not product_list:
        return jsonify({"message": "You don't have any products"})

    return jsonify(product_list)
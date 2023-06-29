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

    result = products.insert_one(new_product)

    if result.inserted_id:
        return jsonify({"message": "Successful"})
    else:
        return jsonify({"message": "error adding product"}), 500

# We have POST, PUT, DELETE and GET 
@products.route("/delete/<id>", methods = ['DELETE'])
def delete_product(id):
    products = db.Products

    products.delete_one({"_id":id})

    return jsonify({"message": "success product deleted"})

@products.route("/sell/<id>", methods = ['PUT'])
def sell_product(id):
    products = db.Products

    quantity_sold = int(request.json['quantity'])
    
    sold_product = products.find_one({"_id":id})

    if not sold_product:
        return jsonify({"message": "Product with given id not found"}), 404
    
    stock = int(sold_product['stock'])
    price = int(sold_product['price'])
    prev_revenue = int(sold_product['revenue'])

    if quantity_sold > stock:
        return jsonify({"message" : "You don't have enough stock available."}), 404
      
    result = products.update_one(
        {"_id":id},
        { "$set": {"stock" : str(stock - quantity_sold),
                    "n_sold" : str(quantity_sold),
                    "revenue" : str(prev_revenue + price * quantity_sold)}}
    )
    if result.modified_count > 0:
        return jsonify({"message": "Successful"})
    else:
        return jsonify({"message": "Unsuccessful"}), 404 

@products.route("/", methods=['GET'])
def see_products():
    
    all_products = db.Products.find({})

    # convert Cursor type to list
    product_list = list(all_products)

    if not product_list:
        return jsonify({"message": "You don't have any products"})

    return jsonify(product_list)

@products.route("/edit/<id>", methods=['POST'])
def product_edit(id):

    # parse json object for data to update i.e. due date
    edit = request.get_json()

    # updates fields according to provided JSON
    result = db.Products.update_one({"_id": id}, {"$set": edit})

    if result.modified_count > 0:
        return jsonify({"message": "Successful"})
    else:
        return jsonify({"message": "Unsuccessful"}), 400 
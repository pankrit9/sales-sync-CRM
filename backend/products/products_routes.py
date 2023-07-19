import datetime
import jwt
from datetime import datetime
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
        "is_electronic": request.json['is_electronic'],
        "n_sold": 0,
        "revenue" : 0
    }

    if request.json['name'] == '':
        return jsonify({"message": "Must enter product name"}), 500
    elif request.json['price'] == '':
        return jsonify({"message": "Must enter price"}), 500
    elif request.json['stock'] == '':
        return jsonify({"message": "Stock must be 0 or greater"}), 500

    result = products.insert_one(new_product)

    if result.inserted_id:
        return jsonify({"message": "Successful"})
    else:
        return jsonify({"message": "error adding product"}), 500

# We have POST, PUT, DELETE and GET 
@products.route("/delete/<id>", methods = ['DELETE'])
def delete_product(id):
    print("id: ", id, "\n")
    products = db.Products
    products.delete_one({"_id":id})
    return jsonify({"message": "success product deleted"})

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

    if not id:
        return jsonify({"message": "Must enter ID of product to edit"}), 400

    # parse json object for data to update i.e. due date
    edit = request.get_json()

    stock = int(edit['stock'])

    result = db.Products.find_one({"_id":id})

    if bool(result['is_electronic']) == True and stock > 0:
        return jsonify({"message": "Electronic products cannot have any stock"}), 400 

    # updates fields according to provided JSON
    result = db.Products.update_one({"_id": id}, {"$set": edit})

    if result.modified_count > 0:
        return jsonify({"message": "Successful"})
    else:
        return jsonify({"message": "Unsuccessful"}), 400 

@products.route("/piechart", methods=['GET'])
def piechart_data():
    all_products = db.Products.find({})

    # convert Cursor type to list
    product_list = list(all_products)

    if not product_list:
        return jsonify({"message": "You don't have any products"})
    
    data = []

    for product in product_list:
        data.append({
            "id": product['name'],
            "label": product['name'],
            "value": product['n_sold'],
        })

    return jsonify(data)
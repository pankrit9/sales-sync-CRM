from config import db
from flask import Blueprint, jsonify, request

# All the api requests that start with auth will be guided here
# so if someone request auth/login then it direct them to this file and then
# search for the route /login
products = Blueprint('products', __name__)

@products.route("/add/<id>", methods = ['POST'])
def add_products(id):
    # Get manager name
    if (db.Accounts.find_one({"_id": id}))['role'] == "manager":
        name = (db.Accounts.find_one({"_id": id}))['full_name']
        company = db.Accounts.find_one({"_id": id})['code']
    else:
        manager_id = (db.Accounts.find_one({"_id": id}))['manager']
        name = db.Accounts.find_one({"_id": manager_id})['full_name']
        company = db.Accounts.find_one({"_id": manager_id})['code']

    products = db.Products

    # Fetch all ids and convert them to integers
    all_prod_ids = [int(products['_id']) for products in db.Products.find({}, {"_id": 1})]
    
    # Generate a taskId based on largest ID in collection
    if not all_prod_ids:
        prodId = 1
    else:
        max_id = max(all_prod_ids)
        prodId = max_id + 1

    # Create new product
    new_product = {
        "_id": str(prodId),
        "name" : request.json['name'],
        "stock" : request.json['stock'],
        "price" : request.json['price'],
        "manager_assigned": name,
        "company": company,
        "is_electronic": request.json['is_electronic'],
        "n_sold": 0,
        "revenue": 0
    }

    # Check field conditions
    if request.json['name'] == '':
        return jsonify({"message": "Must enter product name"}), 400
    elif request.json['price'] == '':
        return jsonify({"message": "Must enter price"}), 400
    elif request.json['stock'] == '':
        return jsonify({"message": "Stock must be 0 or greater"}), 400

    # Insert new product into collection, throw error if not successful
    result = products.insert_one(new_product)
    if result.inserted_id:
        return jsonify({"message": "Successful"}), 200
    else:
        return jsonify({"message": "Error adding product"}), 500

@products.route("/delete/<id>", methods = ['DELETE'])
def delete_product(id):
    # Get product based on id and delete from collection
    result = db.Products.delete_one({"_id":id})
    if result.modified_count > 0:
        return jsonify({"message": "Successful"}), 200
    else:
        return jsonify({"message": "Error deleting product"}), 400

@products.route("/<id>", methods=['GET'])
def see_products(id):
    if (db.Accounts.find_one({"_id": id}))['role'] == "manager":
        company = db.Accounts.find_one({"_id": id})['code']
    else:
        manager_id = (db.Accounts.find_one({"_id": id}))['manager']
        company = db.Accounts.find_one({"_id": manager_id})['code']
    
    # Get all products from collection and turn into list
    all_products = db.Products.find({"company": company})
    product_list = list(all_products)

    # If no products, throw error, else return list of products
    if not product_list:
        return jsonify({"message": "You don't have any products"}), 404
    return jsonify(product_list), 200

@products.route("/edit/<id>", methods=['POST'])
def product_edit(id):
    # If id not provided, throw error, else get product with that id
    if not id:
        return jsonify({"message": "Must enter ID of product to edit"}), 400
    result = db.Products.find_one({"_id":id})

    # Parse json object for data to update
    edit = request.get_json()
    stock = int(edit['stock'])

    # If product is electronic (i.e. has no stock), cannot update its stock field
    if bool(result['is_electronic']) == True and stock > 0:
        return jsonify({"message": "Electronic products cannot have any stock"}), 400 

    # Update fields according to provided JSON
    result = db.Products.update_one({"_id": id}, {"$set": edit})
    if result.modified_count > 0:
        return jsonify({"message": "Successful"}), 200
    else:
        return jsonify({"message": "Unsuccessful"}), 400 
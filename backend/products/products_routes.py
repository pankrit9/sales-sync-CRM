import datetime
import jwt
from datetime import datetime
from config import db
from flask import Blueprint, jsonify, request
from decorators import jwt_required, manager_required, token_required
# from flask_jwt_extended import jwt_required

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

@products.route("/sell/<id>", methods = ['PUT'])
def sell_product(id):
    products = db.Products

    quantity_sold = int(request.json['quantity'])
    sold_by = request.json['staff']
    sold_product = products.find_one({"_id":id})

    staff = db.Accounts.find_one({"_id":sold_by})

    if not sold_product:
        return jsonify({"message": "Product with given id not found"}), 404
    
    stock = int(sold_product['stock'])
    price = int(sold_product['price'])
    is_electronic = bool(sold_product['is_electronic'])
    prev_revenue = int(sold_product['revenue'])

    if quantity_sold > stock and not is_electronic:
        return jsonify({"message" : "You don't have enough stock available."}), 404
      

    db.Accounts.update_one(
        {"_id":sold_by},
        { "$set": {"revenue" : str(int(staff['revenue']) + price * quantity_sold)}}
    )

    register_sale("today",staff["first_name"],sold_by ,price * quantity_sold, [])

    if not is_electronic:   
        result = products.update_one(
            {"_id":id},
            { "$set": {"stock" : str(stock - quantity_sold),
                        "n_sold" : str(quantity_sold),
                        "revenue" : str(prev_revenue + price * quantity_sold)}}
        )

    else:
        result = products.update_one(
            {"_id":id},
            { "$set": {"stock" : str(stock),
                        "n_sold" : str(quantity_sold),
                        "revenue" : str(prev_revenue + price * quantity_sold)}}
         )
        
    if result.modified_count > 0:
        return jsonify({"message": "Successful"})
    else:
        return jsonify({"message": "Unsuccessful"}), 404 

@products.route("/<token>", methods=['GET'])
def see_products(token):
    
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


def register_sale(deadline,staff, staffId, amount, products_sold):

    # Fetch all ids and convert them to integers
    all_records_ids = [int(record['_id']) for record in db.Sales.find({}, {"_id": 1})]
    
    # Generate a taskId based on largest ID in collection
    if not all_records_ids:
        recordId = 1
    else:
        max_id = max(all_records_ids)
        recordId = max_id + 1

    db.Sales.insert_one({
        "_id": recordId,
        "status":"Paid",
        "deadline": deadline,
        "products_sold": products_sold,
        "staff":staff,
        "staff_id":staffId,
        "date": datetime.now(),
        "amount":amount
    })
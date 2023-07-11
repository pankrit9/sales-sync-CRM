from config import db
from flask import Blueprint, jsonify, request
from datetime import datetime

tasks = Blueprint('tasks', __name__)

# STRUCTURE

# route: '/'
# if the user role is manager, then return tasks of THAT ID manager_assigned
# if the user role is staff, then return tasks of THAT ID staff_member_assigned

# route: '/create'
# only the manager can create tasks

# route: '/update/<taskId>'
# update the task with the given taskId
# frontend: get taskId from the current selected task

# @Tasks.route("/<role>/<userId>/tasks", methods=['PUT'])
# @manager_required     # role is being fetched and checked here


@tasks.route("/<id>", methods=['GET'])
def get_tasks(id):
    curr_user = db.Accounts.find_one({"_id": id})

    try:
        if curr_user["role"] == "manager":
            task_query = {"manager_assigned": curr_user["first_name"]}
            # task_query = {"manager_assigned": "test"}

        elif curr_user["role"] == "staff":
            task_query = {"staff_member_assigned": curr_user["first_name"]}
        else:
            return jsonify({"message": "Invalid role"}), 400
        
        # get the tasks from the database
        tasks = db.Tasks.find(task_query)

        # convert the cursor to a list
        tasks_list = list(tasks)

        # return the list of tasks
        return jsonify(tasks_list)
    except Exception as e:

        return jsonify({"message": str(e)}), 500


# Creates new task
# For frontend: cannot submit if required fields aren't provided
# required fields = taskDescription, Priority, Due Date, Assign Staff
# For frontend: make priority field drop down = {low, medium, high}
# For frontend: 'Add Task' button should not be visible for staff
# For frontend: If possible, can add drop down selection of staff to
# assign based on staff accounts, instead of trying to string match
# their names on input
# @manTasks.route("/create/", methods=['POST'])
# def manager_create_task():
@tasks.route("/create/<uId>", methods=['POST'])
def manager_create_task(uId):
    curr_user = db.Accounts.find_one({"_id": uId})
    
    tasks = db.Tasks
    
    # Fetch all ids and convert them to integers
    all_task_ids = [int(task['_id']) for task in db.Tasks.find({}, {"_id": 1})]
    
    # Generate a taskId based on largest ID in collection
    if not all_task_ids:
        taskId = 1
    else:
        max_id = max(all_task_ids)
        taskId = max_id + 1

    # note, need to have '_id' in order to avoid mongodb creating an
    # object id
    new_task = {
        "_id": str(taskId),
        "entry_date": datetime.now(),
        "manager_assigned": curr_user["first_name"],
        "task_description": request.json.get('task_description'),
        "client_assigned": request.json.get('client_assigned'),
        "product": request.json.get('product'),
        "product_quantity": request.json.get('product_quantity'),
        "priority": request.json.get('priority'),
        "due_date": request.json.get('due_date'),
        "staff_member_assigned": request.json.get('staff_member_assigned'),
        "complete": request.json.get('complete'),
    }

    # inserts new task into collection
    result = tasks.insert_one(new_task)

    if result.inserted_id:
        return jsonify({"message": "Successful"})
    else:
        return jsonify({"message": "error adding product"}), 500


# delete task
@tasks.route("/delete/<taskId>", methods=['DELETE'])
def manager_task_delete(taskId):
    print("task id: ", taskId)
    
    # delete task from db based on task ID
    result = db.Tasks.delete_one({"_id":taskId})

    if result.deleted_count > 0:
        return jsonify({"message": "Successful"})
    else:
        return jsonify({"message": "Unsuccessful"}), 400

# If staff tries to edit task, allow to edit only the status
# if manager tries to edit task, allow to edit everything except task id
@tasks.route("/edit/<uId>/<taskId>", methods=['POST'])
def manager_task_edit(uId, taskId):
    
    # parse json object for data to update i.e. due date
    edit = request.get_json()
    print("edit: ", edit)

    # updates fields according to provided JSON
    result = db.Tasks.update_one({"_id": taskId}, {"$set": edit})

    if edit['complete'] == "Completed":
        db.Tasks.update_one({"_id": taskId}, {"$set": {'completion_date': datetime.now()}})
    
    if edit['complete'] == "Completed" and (db.Tasks.find_one({"_id": taskId}))['product']: 
        product_name = (db.Tasks.find_one({"_id": taskId}))['product']
        product_id = (db.Products.find_one({"name": product_name}))['_id']
        qty_sold = (db.Tasks.find_one({"_id": taskId}))['product_quantity']
        sold_by = (db.Tasks.find_one({"_id": taskId}))['staff_member_assigned']
        client = (db.Tasks.find_one({"_id": taskId}))['client_assigned']
        update_products(product_id, qty_sold)
        update_accounts(product_id, qty_sold, sold_by)
        update_sales(product_id, qty_sold, sold_by)
        update_clients(client)

    if result.modified_count > 0:
        return jsonify({"message": "Successful"})
    else:
        return jsonify({"message": "Unsuccessful"}), 400


def update_products(id, qty_sold):
    products = db.Products

    quantity_sold = int(qty_sold)
    sold_product = products.find_one({"_id":id})

    if not sold_product:
        return jsonify({"message": "Product with given id not found"}), 404
    
    stock = int(sold_product['stock'])
    price = int(sold_product['price'])
    is_electronic = bool(sold_product['is_electronic'])
    prev_revenue = int(sold_product['revenue'])
    #status = request.json['payment_status']
    #method = request.json['payment_method']
    
    if quantity_sold > stock and not is_electronic:
        return jsonify({"message" : "You don't have enough stock available."}), 404

    if not is_electronic:   
        result = products.update_one(
            {"_id":id},
            { "$set": {"stock" : stock - quantity_sold,
                        "n_sold" : quantity_sold,
                        "revenue" : prev_revenue + price * quantity_sold}}
        )

    else:
        result = products.update_one(
            {"_id":id},
            { "$set": {"stock" : stock,
                        "n_sold" : quantity_sold,
                        "revenue" : prev_revenue + price * quantity_sold}}
         )
    
    if result.modified_count > 0:
        return jsonify({"message": "Successful"})
    else:
        return jsonify({"message": "Unsuccessful"}), 404 


def update_accounts(id, qty_sold, sold_by):
    products = db.Products

    staff = db.Accounts.find_one({"first_name":sold_by})
    quantity_sold = int(qty_sold)
    sold_product = products.find_one({"_id":id})
    price = int(sold_product['price'])

    db.Accounts.update_one(
        {"first_name": sold_by},
        { "$set": {"revenue": str(int(staff['revenue']) + price * quantity_sold)}}
    )

def update_sales(product_id, qty_sold, sold_by):
    product_price = int((db.Products.find_one({"_id":product_id}))['price'])
    
    # Fetch all ids and convert them to integers
    all_sale_ids = [int(sale['_id']) for sale in db.Sales.find({}, {"_id": 1})]
    
    # Generate a taskId based on largest ID in collection
    if not all_sale_ids:
        sale_id = 1
    else:
        max_id = max(all_sale_ids)
        sale_id = max_id + 1

    db.Sales.insert_one({
        "_id": sale_id,
        "product_id": int(product_id),
        "quantity_sold": int(qty_sold),
        "product_price": product_price,
        "sold_by": sold_by,
        "date_of_sale": datetime.now(),
        "client_id": "To be Implemented",
        "revenue": int(qty_sold) * product_price,
        "staff": "To be Implemented",
        "payment_method":"To be Implemented",
        "payment_status": "To be Implemented",
        "deadline": "To be Implemented",
    })

def update_clients(client):
    db.Clients.update_one({"client" : client}, {"$set": {'last_sale': datetime.now()}})
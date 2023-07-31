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
    # Get the account of the user accessing this route
    # and set query based on role, or throw error if invalid
    curr_user = db.Accounts.find_one({"_id": id})
    if curr_user["role"] == "manager":
        task_query = {"manager_assigned": curr_user["full_name"]}
    elif curr_user["role"] == "staff":
        task_query = {"staff_member_assigned": curr_user["full_name"]}
    else:
        return jsonify({"message": "Invalid role"}), 400
    
    # get the tasks from the database and return as list
    tasks = db.Tasks.find(task_query)
    tasks_list = list(tasks)
    return jsonify(tasks_list)

@tasks.route("/create/<uId>", methods=['POST'])
def manager_create_task(uId):
    # Get account information of user access this route
    curr_user = db.Accounts.find_one({"_id": uId})

    # Fetch all ids and convert them to integers
    tasks = db.Tasks
    all_task_ids = [int(task['_id']) for task in db.Tasks.find({}, {"_id": 1})]
    
    # Generate a taskId based on largest ID in collection
    if not all_task_ids:
        taskId = 1
    else:
        max_id = max(all_task_ids)
        taskId = max_id + 1

    # Parsing for easy calculations
    stock = (db.Products.find_one({"name": request.json.get('product')}))['stock']
    is_electronic = (db.Products.find_one({"name": request.json.get('product')}))['is_electronic']
    date_string = request.json.get('due_date')
    
    # Throw error if not enough stock available for sale
    if int(request.json.get('product_quantity')) > int(stock) and not is_electronic:
        return jsonify({"message" : "You don't have enough stock available."}), 404
            
    # Create new task and insert into collection
    new_task = {
        "_id": str(taskId),
        "entry_date": datetime.now(),
        "manager_assigned": curr_user["full_name"],
        "task_description": request.json.get('task_description'),
        "client_assigned": request.json.get('client_assigned'),
        "product": request.json.get('product'),
        "product_quantity": request.json.get('product_quantity'),
        "priority": request.json.get('priority'),
        "due_date": datetime.strptime(date_string, "%Y-%m-%d"),
        "staff_member_assigned": request.json.get('staff_member_assigned'),
        "complete": request.json.get('complete'),
    }
    result = tasks.insert_one(new_task)

    # Update stock levels and task count
    if result.inserted_id:
        quantity_staged = request.json.get('product_quantity')
        db.Products.update_one(
            {"name": request.json.get('product')},
            {"$set": {"stock" : int(stock) - int(quantity_staged)}})
        tasks_n = (db.Accounts.find_one({"full_name" : request.json.get('staff_member_assigned')}))['tasks_n']
        db.Accounts.update_one(
            {"full_name" : request.json.get('staff_member_assigned')},
            {"$set": {"tasks_n": int(tasks_n) + 1}}
        )
        return jsonify({"message": "Successful"}), 200
    else:
        return jsonify({"message": "error adding product"}), 500

@tasks.route("/delete/<taskId>", methods=['DELETE'])
def manager_task_delete(taskId):
    # Set deduct to true if the task is not completed
    deduct = False
    if (db.Tasks.find_one({"_id":taskId}))['complete'] != 'Completed':
        deduct = True
        staff_name = db.Tasks.find_one({"_id":taskId})['staff_member_assigned']
    
    # delete task from db based on task ID
    result = db.Tasks.delete_one({"_id":taskId})

    # If deduct is true, reduce task count for assigned staff
    if result.deleted_count > 0:
        if deduct:
            tasks_n = (db.Accounts.find_one({"full_name": staff_name}))['tasks_n']
            db.Accounts.update_one(
                {"full_name" : staff_name},
                {"$set": {"tasks_n": int(tasks_n) - 1}}
            )
        return jsonify({"message": "Successful"}), 200
    else:
        return jsonify({"message": "Error updating products and accounts"}), 500

# If staff tries to edit task, allow to edit only the status
# if manager tries to edit task, allow to edit everything except task id
@tasks.route("/edit/<uId>/<taskId>", methods=['POST'])
def manager_task_edit(uId, taskId):
    taskId = str(taskId)

    # parse json object for data to update i.e. due date
    data = request.get_json()

    # create new task
    edit = {
        "task_description": request.json.get('task_description'),
        "client_assigned": request.json.get('client_assigned'),
        "product": request.json.get('product'),
        "product_quantity": request.json.get('product_quantity'),
        "priority": request.json.get('priority'),
        "due_date": datetime.strptime(data['due_date'], '%a, %d %b %Y %H:%M:%S %Z'),
        "staff_member_assigned": request.json.get('staff_member_assigned'),
        "complete": request.json.get('complete'),
    }

    # updates fields according to provided JSON
    result = db.Tasks.update_one({"_id": taskId}, {"$set": edit})

    # Add completion date if task has been set to completed
    if edit['complete'] == "Completed":
        db.Tasks.update_one({"_id": taskId}, {"$set": {'completion_date': datetime.now()}})
    
    # If task has been completed, update all other collections to reflect the successful sale
    if edit['complete'] == "Completed" and (db.Tasks.find_one({"_id": taskId}))['product']: 
        product_name = (db.Tasks.find_one({"_id": taskId}))['product']
        product_id = (db.Products.find_one({"name": product_name}))['_id']
        qty_sold = (db.Tasks.find_one({"_id": taskId}))['product_quantity']
        sold_by = (db.Tasks.find_one({"_id": taskId}))['staff_member_assigned']
        manager_assigned = (db.Tasks.find_one({"_id": taskId}))['manager_assigned']
        client = (db.Tasks.find_one({"_id": taskId}))['client_assigned']
        update_products(product_id, qty_sold)
        update_accounts(product_id, qty_sold, sold_by)
        update_sales(product_id, qty_sold, sold_by, manager_assigned, client)
        update_clients(client, product_name, qty_sold, sold_by)
    if result.modified_count > 0:
        return jsonify({"message": "Successful"}), 200
    else:
        return jsonify({"message": "Unsuccessful"}), 500
    
# HELPER FUNCTIONS #

def update_products(id, qty_sold):
    products = db.Products
    
    # Get sold product from collection based on provided id and
    # convert provided qty to int for calcs
    quantity_sold = int(qty_sold)
    sold_product = products.find_one({"_id":id})
    if not sold_product:
        return jsonify({"message": "Product with given id not found"}), 404
    
    # Parse sold product into its fields   
    price = float(sold_product['price'])
    n_sold = int(sold_product['n_sold'])
    is_electronic = bool(sold_product['is_electronic'])
    prev_revenue = float(sold_product['revenue'])
    #status = request.json['payment_status']
    #method = request.json['payment_method']

    # Update number sold and revenue
    if not is_electronic:   
        result = products.update_one(
            {"_id":id},
            { "$set": { "n_sold" : n_sold + quantity_sold,
                        "revenue" : prev_revenue + price * quantity_sold}}
        )
    else:
        result = products.update_one(
            {"_id":id},
            { "$set": { "n_sold" : n_sold + quantity_sold,
                        "revenue" : prev_revenue + price * quantity_sold}}
        )
    if result.modified_count > 0:
        return jsonify({"message": "Successful"}), 200
    else:
        return jsonify({"message": "Unsuccessful"}), 404 

def update_accounts(id, qty_sold, sold_by):
    products = db.Products

    # Get account of staff member, convert qty to int, get sold product and 
    # ensure price is in float format
    staff = db.Accounts.find_one({"full_name":sold_by})
    quantity_sold = int(qty_sold)
    sold_product = products.find_one({"_id":id})
    price = float(sold_product['price'])

    # Update account with sale information
    db.Accounts.update_one(
        {"full_name": sold_by},
        { "$set": {"revenue": str(float(staff['revenue']) + price * quantity_sold)}}
    )
    tasks_n = (db.Accounts.find_one({"full_name" : sold_by}))['tasks_n']
    db.Accounts.update_one(
            {"full_name" : sold_by},
            {"$set": {"tasks_n": int(tasks_n) - 1}}
    )

def update_sales(product_id, qty_sold, sold_by, manager_assigned, client):
    product_price = float((db.Products.find_one({"_id":product_id}))['price'])
    
    # Fetch all ids and convert them to integers
    all_sale_ids = [int(sale['_id']) for sale in db.Sales.find({}, {"_id": 1})]
    
    # Generate a taskId based on largest ID in collection
    if not all_sale_ids:
        sale_id = 1
    else:
        max_id = max(all_sale_ids)
        sale_id = max_id + 1

    # Create sale and insert into database
    db.Sales.insert_one({
        "_id": sale_id,
        "product_id": int(product_id),
        "quantity_sold": int(qty_sold),
        "product_price": product_price,
        "sold_by": sold_by,
        "manager_assigned": manager_assigned, 
        "date_of_sale": datetime.now(),
        "client_id": client,
        "revenue": float(qty_sold) * product_price,
        "staff": "To be Implemented",
        "payment_method":"To be Implemented",
        "payment_status": "To be Implemented",
        "deadline": "To be Implemented",
    })

def update_clients(client, product_name, qty_sold, sold_by):
    # Update client with sale information
    new_interaction =  {"product_name": product_name,
                        "completed_date": datetime.now(),
                        "qty": qty_sold,
                        "staff": sold_by}
    db.Clients.update_one({"client" : client},
                           {"$push": {'tasks_records': new_interaction}})
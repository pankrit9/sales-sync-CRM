from datetime import datetime, timedelta
from config import db
from flask import Blueprint, jsonify

sales = Blueprint('sales', __name__)

@sales.route("/tasks/<id>", methods = ['GET'])
def get_task_count(id):
    # Get the account of the user accessing this route
    # and set query based on role, or throw error if invalid
    curr_user = db.Accounts.find_one({"_id": id})
    if curr_user["role"] == "manager":
        query = "manager_assigned"
    elif curr_user["role"] == "staff":
        query = "staff_member_assigned"
    else:
        return jsonify({"message": "Invalid role"}), 400
    
    # Count all non-completed tasks assigned to the current user
    # and return the count
    task_count = db.Tasks.count_documents({
        query : curr_user["full_name"],
        "complete": {"$ne": "Completed"}
    })
    return jsonify(task_count), 200

@sales.route("/ltv/<id>", methods = ['GET'])
def get_ltv(id):
    # Get the account of the user accessing this route
    # and set query based on role, or throw error if invalid
    curr_user = db.Accounts.find_one({"_id": id})
    if curr_user["role"] == "manager":
        query = "manager_assigned"
        query_2 = "manager_assigned"
    elif curr_user["role"] == "staff":
        query = "sold_by"
        query_2 = "staff_member_assigned"
    else:
        return jsonify({"message": "Invalid role"}), 400
    
    # Get all sales based on the current user
    sales = db.Sales.find({query : curr_user["full_name"]})

    # Get all tasks assigned to the current user and count
    curr_user_tasks = db.Tasks.find({
        query_2 : curr_user["full_name"],
        "complete": "Completed"
    })
    n_clients = len({task["client_assigned"] for task in curr_user_tasks})
    
    # Calculate LTV
    revenue_sum = 0
    n_purchases = 0
    for sale in sales:
        revenue_sum += sale['revenue']
        n_purchases += 1
    if n_purchases == 0:
        apv = 0
    else:
        apv = revenue_sum / n_purchases
    if n_clients == 0:
        pf = 0
    else:
        pf = n_purchases / n_clients
    # Average customer lifespan - hardcoded for demonstration
    acl = 1 / 0.3 
    ltv = apv * pf * acl

    return jsonify(ltv), 200

@sales.route("/clients/<id>", methods = ['GET'])
def get_client_count(id):
    # Get the account of the user accessing this route
    # and set query based on role, or throw error if invalid
    curr_user = db.Accounts.find_one({"_id": id})
    if curr_user["role"] == "manager":
        query = "manager_assigned"
    elif curr_user["role"] == "staff":
        query = "staff_member_assigned"
    else:
        return jsonify({"message": "Invalid role"}), 400

    # Get all completed tasks associated with current user
    # and count the set of clients in that list of tasks
    curr_user_tasks = db.Tasks.find({
        query : curr_user["full_name"],
        "complete": "Completed"    
    })
    n_clients = len({task["client_assigned"] for task in curr_user_tasks})

    return jsonify(n_clients), 200

@sales.route("/winrate/<id>", methods = ['GET'])
def get_win_rate(id):
    # Get the account of the user accessing this route
    # and set query based on role, or throw error if invalid
    curr_user = db.Accounts.find_one({"_id": id})
    if curr_user["role"] == "manager":
        query = "manager_assigned"
    elif curr_user["role"] == "staff":
        query = "staff_member_assigned"
    else:
        return jsonify({"message": "Invalid role"}), 400
    
    # Get all completed tasks with a client assigned associated with current user
    # and count the set of clients in that list of tasks
    curr_user_tasks_complete = db.Tasks.find({
        query : curr_user["full_name"],
        "client_assigned": {"$ne": ''},
        "complete": "Completed"
    })
    n_clients_complete = len({task["client_assigned"] for task in curr_user_tasks_complete})

    # Get all tasks with a client assigned associated with current user
    # and count the set of clients in that list of tasks
    curr_user_tasks_all = db.Tasks.find({
        query : curr_user["full_name"],
        "client_assigned": {"$ne": ''},
    })
    n_clients_all = len({task["client_assigned"] for task in curr_user_tasks_all})

    # Calculate win rate for the current user by taking all clients with completed tasks
    # and dividing by all clients in total
    if n_clients_all == 0:
        win_rate = 0
    else: 
        win_rate = n_clients_complete / n_clients_all

    return jsonify(win_rate), 200

@sales.route("/leadsource/<id>", methods = ['GET'])
def get_lead_source(id):
    name = get_manager_name(id)

    # Lead source types
    lead_types = [
        "Google", 
        "LinkedIn", 
        "Cold Call/Email", 
        "Referral", 
        "Paid Social Ads"
    ]

    # For each lead type, loop through clients and count
    # the number of instances of it, then append to array
    data = []
    for lead in lead_types:
        count = db.Clients.count_documents({
            "lead_source": lead,
            "manager_assigned": name,
        })
        data.append({
            "lead_source_name": lead,
            lead : count
        })
    return jsonify(data), 200

@sales.route("/closedrev/<id>", methods = ['GET'])
def get_closed_rev(id):

    curr_date = datetime.now()    
    data = []

    # Get the name of the manager
    name = get_manager_name(id)

    # Get list of staff in the manager's team who have made sales
    sales = db.Sales.find({"manager_assigned": name})
    staff_list = list(set([staff['sold_by'] for staff in sales]))

    # From start of the year to current date, for each month
    # tally the sales closed for that month for each staff
    # member and append to array for return
    i = 1
    while (datetime(curr_date.year, i, 1) <= curr_date):
        monthly_sales = {}
        for staff in staff_list:
            rev_closed = 0
            staff_sales = db.Sales.find({"sold_by": staff})
            for sale in staff_sales:
                month = (sale['date_of_sale']).month
                year = (sale['date_of_sale']).year
                if month == i and year == curr_date.year:
                    rev_closed += sale['revenue']
            monthly_sales[staff] = rev_closed
        data.append(monthly_sales)
        i+=1
    
    return jsonify(data), 200

@sales.route("/closedkeys/<id>", methods = ['GET'])
def get_closed_keys(id):
    # Get the name of the manager
    name = get_manager_name(id)

    # Get list of all staff to be the key for the closed revenue graph
    sales = db.Sales.find({"manager_assigned": name})
    staff_list = list(set([staff['sold_by'] for staff in sales]))
    return jsonify(staff_list), 200

@sales.route("/closedrevsum/<id>", methods = ['GET'])
def get_closed_rev_sum(id):
    # Get the name of the manager
    name = get_manager_name(id)

    curr_date = datetime.now()
    
    # Get all sales, loop through and count the combined revenue of those
    # from the start of the year til the current date
    sales = db.Sales.find({"manager_assigned": name})
    rev_closed = 0
    for sale in sales:
        if sale['date_of_sale'] >= datetime(curr_date.year, 1, 1) and sale['date_of_sale'] <= curr_date:
            rev_closed += sale['revenue']
    return jsonify(rev_closed), 200

@sales.route("/projrev/<id>", methods = ['GET'])
def get_proj_rev(id):

    name = get_manager_name(id)

    curr_date = datetime.now()
    data = []

    # Get list of all staff assigned to tasks
    sales = db.Tasks.find({"manager_assigned": name})
    staff_list = list(set([staff['staff_member_assigned'] for staff in sales]))
    
    # From current date to end of the year, for each month
    # tally the sales projected for that month for each staff
    # member and append to array for return
    i = curr_date.month
    while (i <= 12):
        monthly_sales = {}
        for staff in staff_list:
            rev_closed = 0
            staff_tasks = db.Tasks.find({
                "staff_member_assigned": staff,
                "due_date": { '$gt': curr_date },
                "complete": { '$ne': "Completed"},
                "client_assigned": {"$ne": ''}
                })
            for task in staff_tasks:
                month = task['due_date'].month
                year = task['due_date'].year
                if month == i and year == curr_date.year:
                    price = task["product_price"]
                    rev_closed += float(task['product_quantity']) * float(price)
            monthly_sales[staff] = rev_closed
        data.append(monthly_sales)
        i+=1
    
    return jsonify(data), 200

@sales.route("/projkeys/<id>", methods = ['GET'])
def get_proj_keys(id):
    name = get_manager_name(id)
    # Get list of all in staff in manager's team to be the key for the projected revenue graph
    tasks = db.Tasks.find({"manager_assigned": name})
    staff_list = list(set([staff['staff_member_assigned'] for staff in tasks]))
    return jsonify(staff_list)

@sales.route("/projrevsum/<id>", methods = ['GET'])
def get_proj_rev_sum(id):
    name = get_manager_name(id)
    # Get all tasks, loop through and count the combined projected revenue for each by month
    # from the current date til the end of the year
    curr_date = datetime.now()
    tasks = db.Tasks.find({"manager_assigned": name})
    rev_closed = 0
    for task in tasks:
        if task['due_date'] >= curr_date and task['complete'] != "Completed":
            price = task["product_price"]
            rev_closed += float(task['product_quantity']) * float(price)
    return jsonify(rev_closed)

@sales.route("/taskgrowth/<id>", methods = ['GET'])
def get_task_growth(id):
    # Get the last updated object
    last_update = db.Growth.find_one({"metric": "n_tasks", "uId": id})
    name = db.Accounts.find_one({"_id": id})['full_name']

    # Count all tasks
    if db.Accounts.find_one({"_id": id})['role'] == "manager":
        task_count = db.Tasks.count_documents({"manager_assigned": name , "complete": { '$ne': "Completed"}})
    else:
        task_count = db.Tasks.count_documents({"staff_member_assigned": name , "complete": { '$ne': "Completed"}})

    # If last entry was longer than 3 days ago, update the values and return the new rate
    # else just return the existing rate
    if not last_update or datetime.now() > (last_update['entry_date'] + timedelta(minutes=240)):
        if not db.Growth.find_one({"uId": id, "metric": "n_tasks"}):
            rate = {
                "metric": "n_tasks",
                "value": task_count,
                "entry_date": datetime.now(),
                "rate": 0,
                "uId": id
            }
            db.Growth.insert_one(rate)
            new_rate = 0
        else:
            db.Growth.update_one({"uId": id, "metric": "n_tasks"}, {"$set": {"value": task_count}})
            if last_update['value'] == 0:
                new_rate = task_count
            else:
                new_rate = (task_count / last_update['value']) - 1
            db.Growth.update_one({"uId": id, "metric": "n_tasks"}, {"$set": {"rate": new_rate, "entry_date" : datetime.now()}})
        return jsonify(new_rate), 200 
    else:
        return jsonify(last_update['rate']), 200
    
@sales.route("/ltvgrowth/<id>", methods = ['GET'])
def get_ltv_growth(id):
    # Get the last updated object
    last_update = db.Growth.find_one({"metric": "ltv", "uId": id})
    
    name = db.Accounts.find_one({"_id": id})['full_name']
    if db.Accounts.find_one({"_id": id})['role'] == "manager":
        sales = db.Sales.find({ "manager_assigned": name })
        n_clients = db.Clients.count_documents({"manager_assigned": name})
    else:
        sales = db.Sales.find({ "sold_by": name })
        # Get the set of the clients assigned to a staff member to calculate thier
        # number of clients
        curr_user_tasks = db.Tasks.find({ "staff_member_assigned" : name })
        n_clients = len({task["client_assigned"] for task in curr_user_tasks})

    # Calculate the current LTV
    revenue_sum = 0
    n_purchases = 0
    for sale in sales:
        revenue_sum += sale['revenue']
        n_purchases += 1
    if n_purchases == 0:
        apv = 0
    else:
        apv = revenue_sum / n_purchases
    if n_clients == 0:
        pf = 0
    else:
        pf = n_purchases / n_clients
    acl = 1 / 0.3 
    ltv = apv * pf * acl

    # If last entry was longer than 3 days ago, update the values and return the new rate
    # else just return the existing rate
    if not last_update or datetime.now() > (last_update['entry_date'] + timedelta(minutes=240)):
        if not db.Growth.find_one({"uId": id, "metric": "ltv"}):
            rate = {
                "metric": "ltv",
                "value": ltv,
                "entry_date": datetime.now(),
                "rate": 0,
                "uId": id
            }
            db.Growth.insert_one(rate)
            new_rate = 0
        else:
            db.Growth.update_one({"uId": id, "metric": "ltv"}, {"$set": {"value": ltv}})
            if last_update['value'] == 0:
                new_rate = ltv
            else:
                new_rate = (ltv / last_update['value']) - 1
            db.Growth.update_one({"uId": id, "metric": "ltv"}, {"$set": {"rate": new_rate, "entry_date" : datetime.now()}})
        return jsonify(new_rate), 200
    else:
        return jsonify(last_update['rate']), 200

@sales.route("/clientgrowth/<id>", methods = ['GET'])
def get_client_growth(id):
    # Get the last updated object
    last_update = db.Growth.find_one({"metric": "n_clients", "uId": id})

    name = db.Accounts.find_one({"_id": id})['full_name']
    if db.Accounts.find_one({"_id": id})['role'] == "manager":
        curr_user_tasks = db.Tasks.find({ "manager_assigned" : name, "complete" : "Completed" })
        client_count = len({task["client_assigned"] for task in curr_user_tasks})
    else:
        # Get the set of the clients assigned to a staff member to calculate thier
        # number of clients
        curr_user_tasks = db.Tasks.find({ "staff_member_assigned" : name, "complete" : "Completed" })
        client_count = len({task["client_assigned"] for task in curr_user_tasks})

    # If last entry was longer than 3 days ago, update the values and return the new rate
    # else just return the existing rate
    if not last_update or datetime.now() > (last_update['entry_date'] + timedelta(minutes=240)):
        if not db.Growth.find_one({"uId": id, "metric": "n_clients"}):
            rate = {
                "metric": "n_clients",
                "value": client_count,
                "entry_date": datetime.now(),
                "rate": 0,
                "uId": id
            }
            db.Growth.insert_one(rate)
            new_rate = 0
        else:
            db.Growth.update_one({"uId": id, "metric": "n_clients"}, {"$set": {"value": client_count}})
            if last_update['value'] == 0:
                new_rate = client_count
            else:
                new_rate = (client_count / last_update['value']) - 1
            db.Growth.update_one({"uId": id, "metric": "n_clients"}, {"$set": {"rate": new_rate, "entry_date" : datetime.now()}})
        return jsonify(new_rate), 200
    else:
        return jsonify(last_update['rate']), 200

@sales.route("/winrategrowth/<id>", methods = ['GET'])
def get_winrate_growth(id):
    # Get the last updated object
    last_update = db.Growth.find_one({"metric": "win_rate", "uId": id})

    name = db.Accounts.find_one({"_id": id})['full_name']
    if db.Accounts.find_one({"_id": id})['role'] == "manager":
        curr_user_tasks_sale = db.Tasks.find({ "manager_assigned" : name, "complete" : "Completed" })
        curr_user_tasks_all = db.Tasks.find({ "manager_assigned" : name })
        n_clients_with_sale = len({task["client_assigned"] for task in curr_user_tasks_sale})
        n_clients = len({task["client_assigned"] for task in curr_user_tasks_all})
    else:
        curr_user_tasks_sale = db.Tasks.find({ "staff_member_assigned" : name, "complete" : "Completed" })
        curr_user_tasks_all = db.Tasks.find({ "staff_member_assigned" : name })
        n_clients_with_sale = len({task["client_assigned"] for task in curr_user_tasks_sale})
        n_clients = len({task["client_assigned"] for task in curr_user_tasks_all})

    # Calculate current win rate
    if n_clients == 0:
        win_rate = 0
    else:
        win_rate = n_clients_with_sale / n_clients
    
    # If last entry was longer than 3 days ago, update the values and return the new rate
    # else just return the existing rate
    if not last_update or datetime.now() > (last_update['entry_date'] + timedelta(minutes=240)):
        if not db.Growth.find_one({"uId": id, "metric": "win_rate"}):
            rate = {
                "metric": "win_rate",
                "value": win_rate,
                "entry_date": datetime.now(),
                "rate": 0,
                "uId": id
            }
            db.Growth.insert_one(rate)
            new_rate = 0
        else:
            db.Growth.update_one({"uId": id, "metric": "win_rate"}, {"$set": {"value": win_rate}})
            if last_update['value'] == 0:
                new_rate = win_rate
            else:
                new_rate = (win_rate / last_update['value']) - 1
            db.Growth.update_one({"uId": id, "metric": "win_rate"}, {"$set": {"rate": new_rate, "entry_date" : datetime.now()}})
        return jsonify(new_rate), 200
    else:
        return jsonify(last_update['rate']), 200
    
@sales.route("/piechart/<id>", methods=['GET'])
def piechart_data(id):
    name = get_manager_name(id)
    print(name)
    # Get all products and put into list
    all_products = db.Products.find({"manager_assigned": name})
    product_list = list(all_products)

    # If there are no products, return error
    if product_list == []:
        return jsonify([]), 200
    
    # Append product data to array and return
    data = []
    for product in product_list:
        data.append({
            "id": product['name'],
            "label": product['name'],
            "value": product['n_sold'],
        })
    return jsonify(data), 200

# HELPER FUNCTIONS #
def get_manager_name(id):
    if (db.Accounts.find_one({"_id": id}))['role'] == "manager":
        name = (db.Accounts.find_one({"_id": id}))['full_name']
    else:
        manager_id = (db.Accounts.find_one({"_id": id}))['manager']
        name = db.Accounts.find_one({"_id": manager_id})['full_name']
    return name
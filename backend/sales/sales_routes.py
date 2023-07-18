from datetime import datetime, timedelta
import jwt
from config import db
from flask import Blueprint, jsonify, request
#from decorators import jwt_required, manager_required, token_required

sales = Blueprint('sales', __name__)

@sales.route("/tasks/<id>", methods = ['GET'])
def get_task_count(id):
    curr_user = db.Accounts.find_one({"_id": id})

    if curr_user["role"] == "manager":
        task_count = db.Tasks.count_documents({
            "manager_assigned": curr_user["first_name"],
            "complete": {"$ne": "Completed"}
        })
        return jsonify(task_count)
    
    elif curr_user["role"] == "staff":
        task_count = db.Tasks.count_documents({
            "staff_member_assigned": curr_user["first_name"],
            "complete": {"$ne": "Completed"}
        })
        return jsonify(task_count)
    
    else:
        return jsonify({"message": "Invalid role"}), 400

@sales.route("/revenue/<id>", methods = ['GET'])
def get_revenue_sum(id):
    
    curr_user = db.Accounts.find_one({"_id": id})
    
    if curr_user["role"] == "manager":
        sales = db.Sales.find({"manager_assigned": curr_user["first_name"]})
    elif curr_user["role"] == "staff":
        sales = db.Sales.find({"sold_by": curr_user["first_name"]})
    else:
        return jsonify({"message": "Invalid role"}), 400
    
    revenue_sum = 0

    for sale in sales:
        revenue_sum += sale['revenue']

    return jsonify(revenue_sum)

@sales.route("/ltv/<id>", methods = ['GET'])
def get_ltv(id):

    curr_user = db.Accounts.find_one({"_id": id})
    
    if curr_user["role"] == "manager":
        sales = db.Sales.find({"manager_assigned": curr_user["first_name"]})
        curr_user_tasks = db.Tasks.find({
            "manager_assigned": curr_user["first_name"],
            "complete": "Completed"
        })
        n_clients = len({task["client_assigned"] for task in curr_user_tasks})
    elif curr_user["role"] == "staff":
        sales = db.Sales.find({"sold_by": curr_user["first_name"]})
        curr_user_tasks = db.Tasks.find({
            "staff_member_assigned": curr_user["first_name"],
            "complete": "Completed"
        })
        n_clients = len({task["client_assigned"] for task in curr_user_tasks})
    else:
        return jsonify({"message": "Invalid role"}), 400
    
    revenue_sum = 0
    n_purchases = 0

    for sale in sales:
        revenue_sum += sale['revenue']
        n_purchases += 1

    # Average Purchase Value
    apv = revenue_sum / n_purchases
    # Purchase frequency
    pf = n_purchases / n_clients
    # Average customer lifespan - Note, this is hardcoded for now
    acl = 1 / 0.3 
    
    ltv = apv * pf * acl

    return jsonify(ltv)

@sales.route("/clients/<id>", methods = ['GET'])
def get_client_count(id):
    curr_user = db.Accounts.find_one({"_id": id})
    
    if curr_user["role"] == "manager":
        curr_user_tasks = db.Tasks.find({
            "manager_assigned": curr_user["first_name"],
            "complete": "Completed"    
        })
        n_clients = len({task["client_assigned"] for task in curr_user_tasks})
    elif curr_user["role"] == "staff":
        curr_user_tasks = db.Tasks.find({
            "staff_member_assigned": curr_user["first_name"],
            "complete": "Completed"    
        })
        n_clients = len({task["client_assigned"] for task in curr_user_tasks})
    else:
        return jsonify({"message": "Invalid role"}), 400

    return jsonify(n_clients)

@sales.route("/winrate/<id>", methods = ['GET'])
def get_win_rate(id):
    curr_user = db.Accounts.find_one({"_id": id})
    
    if curr_user["role"] == "manager":
        curr_user_tasks_complete = db.Tasks.find({
            "manager_assigned": curr_user["first_name"],
            "client_assigned": {"$ne": ''},
            "complete": "Completed"
        })
        n_clients_complete = len({task["client_assigned"] for task in curr_user_tasks_complete})
        curr_user_tasks_all = db.Tasks.find({
            "manager_assigned": curr_user["first_name"],
            "client_assigned": {"$ne": ''},
        })
        n_clients_all = len({task["client_assigned"] for task in curr_user_tasks_all})

    elif curr_user["role"] == "staff":
        curr_user_tasks_complete = db.Tasks.find({
            "staff_member_assigned": curr_user["first_name"],
            "client_assigned": {"$ne": ''},
            "complete": "Completed" 
        })
        n_clients_complete = len({task["client_assigned"] for task in curr_user_tasks_complete})
        curr_user_tasks_all = db.Tasks.find({
            "staff_member_assigned": curr_user["first_name"],
            "client_assigned": {"$ne": ''},
        })
        n_clients_all = len({task["client_assigned"] for task in curr_user_tasks_all})
    else:
        return jsonify({"message": "Invalid role"}), 400
    
    win_rate = n_clients_complete / n_clients_all

    return jsonify(win_rate)

@sales.route("/leadsource", methods = ['GET'])
def get_lead_source():
    lead_types = [
        "Google", 
        "LinkedIn", 
        "Cold Call/Email", 
        "Referral", 
        "Paid Social Ads"
    ]

    data = []

    for lead in lead_types:
        count = db.Clients.count_documents({
            "lead_source": lead
        })
        data.append({
            "lead_source_name": lead,
            lead : count
        })
    return jsonify(data)


@sales.route("/closedrev", methods = ['GET'])
def get_closed_rev():
    curr_date = datetime.now()    
    data = []

    sales = db.Sales.find({})
    staff_list = list(set([staff['sold_by'] for staff in sales]))

    i = 1
    while (datetime(curr_date.year, i, 1) <= curr_date):
        monthly_sales = {}
        for staff in staff_list:
            rev_closed = 0
            staff_sales = db.Sales.find({"sold_by": staff})
            
            for sale in staff_sales:
                month = (datetime.strptime(sale['date_of_sale'], "%Y-%m-%d")).month
                year = (datetime.strptime(sale['date_of_sale'], "%Y-%m-%d")).year
                
                if month == i and year == curr_date.year:
                    rev_closed += sale['revenue']
            
            monthly_sales[staff] = rev_closed

        data.append(monthly_sales)
        i+=1
    
    return jsonify(data)

@sales.route("/closedkeys", methods = ['GET'])
def get_closed_keys():
    sales = db.Sales.find({})
    staff_list = list(set([staff['sold_by'] for staff in sales]))
    return jsonify(staff_list)

@sales.route("/closedrevsum", methods = ['GET'])
def get_closed_rev_sum():
    curr_date = datetime.now()
    sales = db.Sales.find({})
    rev_closed = 0

    for sale in sales:
        if datetime.strptime(sale['date_of_sale'], "%Y-%m-%d") >= datetime(curr_date.year, 1, 1) and datetime.strptime(sale['date_of_sale'], "%Y-%m-%d") <= curr_date:
            rev_closed += sale['revenue']
            
    return jsonify(rev_closed)


@sales.route("/projrev", methods = ['GET'])
def get_proj_rev():
    curr_date = datetime.now()
    data = []

    sales = db.Tasks.find({})
    staff_list = list(set([staff['staff_member_assigned'] for staff in sales]))

    i = curr_date.month + 1
    while (i <= 12):
        monthly_sales = {}
        for staff in staff_list:
            rev_closed = 0
            staff_tasks = db.Tasks.find({
                "staff_member_assigned": staff,
                "due_date": { '$gt': curr_date }
                })
            
            for task in staff_tasks:
                month = (datetime.strptime(task['due_date'], "%Y-%m-%d")).month
                year = (datetime.strptime(task['due_date'], "%Y-%m-%d")).year

                if month == i and year == curr_date.year:
                    price = (db.Products.find_one({'name': task['product']}))['price']
                    rev_closed += int(task['product_quantity']) * int(price)
            
            monthly_sales[staff] = rev_closed

        data.append(monthly_sales)
        i+=1
    
    return jsonify(data)

@sales.route("/projkeys", methods = ['GET'])
def get_proj_keys():
    tasks = db.Tasks.find({})
    staff_list = list(set([staff['staff_member_assigned'] for staff in tasks]))
    return jsonify(staff_list)

@sales.route("/projrevsum", methods = ['GET'])
def get_proj_rev_sum():
    curr_date = datetime.now()
    tasks = db.Tasks.find({})
    rev_closed = 0

    for task in tasks:
        if datetime.strptime(task['due_date'], "%Y-%m-%d") >= curr_date:
            price = (db.Products.find_one({'name': task['product']}))['price']
            rev_closed += int(task['product_quantity']) * int(price)
            
    return jsonify(rev_closed)

@sales.route("/taskgrowth", methods = ['GET'])
def get_task_growth():
    last_update = db.Growth.find_one({"metric": "n_tasks"})
    date_string = last_update['entry_date']
    task_count = db.Tasks.count_documents({})

    if datetime.now() > (datetime.strptime(date_string, "%Y-%m-%d") + timedelta(days=1)):
        db.Growth.update_one({"metric": "n_tasks"}, {"$set": {"value": task_count}})
        new_rate = (task_count / last_update['value']) - 1
        db.Growth.update_one({"metric": "n_tasks"}, {"$set": {"rate": new_rate}})
        return jsonify(new_rate)
    else:
        return jsonify(last_update['rate'])
    

@sales.route("/ltvgrowth", methods = ['GET'])
def get_ltv_growth():
    last_update = db.Growth.find_one({"metric": "ltv"})
    date_string = last_update['entry_date']

    sales = db.Sales.find({})
    
    revenue_sum = 0
    n_purchases = 0

    for sale in sales:
        revenue_sum += sale['revenue']
        n_purchases += 1

    n_client = db.Clients.count_documents({})

    # Average Purchase Value
    apv = revenue_sum / n_purchases
    # Purchase frequency
    pf = n_purchases / n_client
    # Average customer lifespan - Note, this is hardcoded for now
    acl = 1 / 0.3 
    
    ltv = apv * pf * acl

    if datetime.now() > (datetime.strptime(date_string, "%Y-%m-%d") + timedelta(days=1)):
        db.Growth.update_one({"metric": "ltv"}, {"$set": {"value": ltv}})
        new_rate = (ltv / last_update['value']) - 1
        db.Growth.update_one({"metric": "ltv"}, {"$set": {"rate": new_rate}})
        return jsonify(new_rate)
    else:
        return jsonify(last_update['rate'])


@sales.route("/clientgrowth", methods = ['GET'])
def get_client_growth():
    last_update = db.Growth.find_one({"metric": "n_clients"})
    date_string = last_update['entry_date']

    client_count = db.Clients.count_documents({})

    if datetime.now() > (datetime.strptime(date_string, "%Y-%m-%d") + timedelta(days=1)):
        db.Growth.update_one({"metric": "n_clients"}, {"$set": {"value": client_count}})
        new_rate = (client_count / last_update['value']) - 1
        db.Growth.update_one({"metric": "n_clients"}, {"$set": {"rate": new_rate}})
        return jsonify(new_rate)
    else:
        return jsonify(last_update['rate'])

@sales.route("/winrategrowth", methods = ['GET'])
def get_winrate_growth():
    last_update = db.Growth.find_one({"metric": "win_rate"})
    date_string = last_update['entry_date']

    n_clients_with_sale = db.Clients.count_documents({'last_sale': {'$exists': True, '$ne': ''}})
    n_clients = db.Clients.count_documents({})
    win_rate = n_clients_with_sale / n_clients

    if datetime.now() > (datetime.strptime(date_string, "%Y-%m-%d") + timedelta(days=1)):
        db.Growth.update_one({"metric": "win_rate"}, {"$set": {"value": win_rate}})
        new_rate = (win_rate / last_update['value']) - 1
        db.Growth.update_one({"metric": "win_rate"}, {"$set": {"rate": new_rate}})
        return jsonify(new_rate)
    else:
        return jsonify(last_update['rate'])
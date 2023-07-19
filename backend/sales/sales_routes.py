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
        query = "manager_assigned"
    elif curr_user["role"] == "staff":
        query = "staff_member_assigned"
    else:
        return jsonify({"message": "Invalid role"}), 400
    
    task_count = db.Tasks.count_documents({
        query : curr_user["first_name"],
        "complete": {"$ne": "Completed"}
    })

    return jsonify(task_count)

@sales.route("/ltv/<id>", methods = ['GET'])
def get_ltv(id):

    curr_user = db.Accounts.find_one({"_id": id})

    if curr_user["role"] == "manager":
        query = "manager_assigned"
        query_2 = "manager_assigned"
    elif curr_user["role"] == "staff":
        query = "sold_by"
        query_2 = "staff_member_assigned"
    else:
        return jsonify({"message": "Invalid role"}), 400
    
    sales = db.Sales.find({query : curr_user["first_name"]})

    curr_user_tasks = db.Tasks.find({
        query_2 : curr_user["first_name"],
        "complete": "Completed"
    })

    n_clients = len({task["client_assigned"] for task in curr_user_tasks})
    
    revenue_sum = 0
    n_purchases = 0

    for sale in sales:
        revenue_sum += sale['revenue']
        n_purchases += 1

    # Average Purchase Value
    if n_purchases == 0:
        apv = 0
    else:
        apv = revenue_sum / n_purchases
    # Purchase frequency
    if n_clients == 0:
        pf = 0
    else:
        pf = n_purchases / n_clients
    
    # Average customer lifespan - Note, this is hardcoded for now
    
    acl = 1 / 0.3 
    
    ltv = apv * pf * acl

    return jsonify(ltv)

@sales.route("/clients/<id>", methods = ['GET'])
def get_client_count(id):
    curr_user = db.Accounts.find_one({"_id": id})

    if curr_user["role"] == "manager":
        query = "manager_assigned"
    elif curr_user["role"] == "staff":
        query = "staff_member_assigned"
    else:
        return jsonify({"message": "Invalid role"}), 400

    curr_user_tasks = db.Tasks.find({
        query : curr_user["first_name"],
        "complete": "Completed"    
    })
    n_clients = len({task["client_assigned"] for task in curr_user_tasks})

    return jsonify(n_clients)

@sales.route("/winrate/<id>", methods = ['GET'])
def get_win_rate(id):
    curr_user = db.Accounts.find_one({"_id": id})

    if curr_user["role"] == "manager":
        query = "manager_assigned"
    elif curr_user["role"] == "staff":
        query = "staff_member_assigned"
    else:
        return jsonify({"message": "Invalid role"}), 400
    
    curr_user_tasks_complete = db.Tasks.find({
        query : curr_user["first_name"],
        "client_assigned": {"$ne": ''},
        "complete": "Completed"
    })
    n_clients_complete = len({task["client_assigned"] for task in curr_user_tasks_complete})
    curr_user_tasks_all = db.Tasks.find({
        query : curr_user["first_name"],
        "client_assigned": {"$ne": ''},
    })
    n_clients_all = len({task["client_assigned"] for task in curr_user_tasks_all})

    
    if n_clients_all == 0:
        win_rate = 0
    else: 
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
                month = (sale['date_of_sale']).month
                year = (sale['date_of_sale']).year
                
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
        if sale['date_of_sale'] >= datetime(curr_date.year, 1, 1) and sale['date_of_sale'] <= curr_date:
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
                "due_date": { '$gt': curr_date },
                "complete": { '$ne': "Complete"}
                })
            
            for task in staff_tasks:
                month = task['due_date'].month
                year = task['due_date'].year

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
        if task['due_date'] >= curr_date and task['complete'] != "Completed":
            price = (db.Products.find_one({'name': task['product']}))['price']
            rev_closed += int(task['product_quantity']) * int(price)
            
    return jsonify(rev_closed)

@sales.route("/taskgrowth", methods = ['GET'])
def get_task_growth():
    last_update = db.Growth.find_one({"metric": "n_tasks"})
    task_count = db.Tasks.count_documents({})

    if datetime.now() > (last_update['entry_date'] + timedelta(days=3)):
        db.Growth.update_one({"metric": "n_tasks"}, {"$set": {"value": task_count}})
        new_rate = (task_count / last_update['value']) - 1
        db.Growth.update_one({"metric": "n_tasks"}, {"$set": {"rate": new_rate}})
        return jsonify(new_rate)
    else:
        return jsonify(last_update['rate'])
    

@sales.route("/ltvgrowth", methods = ['GET'])
def get_ltv_growth():
    last_update = db.Growth.find_one({"metric": "ltv"})

    sales = db.Sales.find({})
    
    revenue_sum = 0
    n_purchases = 0

    for sale in sales:
        revenue_sum += sale['revenue']
        n_purchases += 1

    n_clients = db.Clients.count_documents({})

    # Average Purchase Value
    if n_purchases == 0:
        apv = 0
    else:
        apv = revenue_sum / n_purchases
    # Purchase frequency
    if n_clients == 0:
        pf = 0
    else:
        pf = n_purchases / n_clients
    
    # Average customer lifespan - Note, this is hardcoded for now
    
    acl = 1 / 0.3 
    
    ltv = apv * pf * acl

    if datetime.now() > (last_update['entry_date'] + timedelta(days=3)):
        db.Growth.update_one({"metric": "ltv"}, {"$set": {"value": ltv}})
        new_rate = (ltv / last_update['value']) - 1
        db.Growth.update_one({"metric": "ltv"}, {"$set": {"rate": new_rate}})
        return jsonify(new_rate)
    else:
        return jsonify(last_update['rate'])


@sales.route("/clientgrowth", methods = ['GET'])
def get_client_growth():
    last_update = db.Growth.find_one({"metric": "n_clients"})

    client_count = db.Clients.count_documents({})

    if datetime.now() > (last_update['entry_date'] + timedelta(days=3)):
        db.Growth.update_one({"metric": "n_clients"}, {"$set": {"value": client_count}})
        new_rate = (client_count / last_update['value']) - 1
        db.Growth.update_one({"metric": "n_clients"}, {"$set": {"rate": new_rate}})
        return jsonify(new_rate)
    else:
        return jsonify(last_update['rate'])

@sales.route("/winrategrowth", methods = ['GET'])
def get_winrate_growth():
    last_update = db.Growth.find_one({"metric": "win_rate"})

    n_clients_with_sale = db.Clients.count_documents({'last_sale': {'$exists': True, '$ne': ''}})
    n_clients = db.Clients.count_documents({})

    if n_clients == 0:
        win_rate = 0
    else:
        win_rate = n_clients_with_sale / n_clients

    if datetime.now() > (last_update['entry_date'] + timedelta(days=3)):
        db.Growth.update_one({"metric": "win_rate"}, {"$set": {"value": win_rate}})
        new_rate = (win_rate / last_update['value']) - 1
        db.Growth.update_one({"metric": "win_rate"}, {"$set": {"rate": new_rate}})
        return jsonify(new_rate)
    else:
        return jsonify(last_update['rate'])
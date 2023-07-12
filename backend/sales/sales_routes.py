from datetime import datetime
import jwt
from config import db
from flask import Blueprint, jsonify, request
#from decorators import jwt_required, manager_required, token_required

sales = Blueprint('sales', __name__)

@sales.route("/tasks", methods = ['GET'])
def get_task_count():
    task_count = db.Tasks.count_documents({})
    return jsonify(task_count)

@sales.route("/revenue", methods = ['GET'])
def get_revenue_sum():
    sales = db.Sales.find({})
    
    revenue_sum = 0

    for sale in sales:
        revenue_sum += sale['revenue']

    return jsonify(revenue_sum)

@sales.route("/ltv", methods = ['GET'])
def get_ltv():

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
    acl = 1 / 0.2 
    
    ltv = apv * pf * acl

    return jsonify(ltv)

@sales.route("/clients", methods = ['GET'])
def get_client_count():
    client_count = db.Clients.count_documents({})
    return jsonify(client_count)

@sales.route("/winrate", methods = ['GET'])
def get_win_rate():
    n_clients_with_sale = db.Clients.count_documents({'last_sale': {'$exists': True, '$ne': ''}})
    n_clients = db.Clients.count_documents({})
    win_rate = n_clients_with_sale / n_clients

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
    print(data)
    return jsonify(data)


@sales.route("/closedrev", methods = ['GET'])
def get_closed_rev():
    print("hello")
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
    sales = db.Sales.find({})
    staff_list = list(set([staff['sold_by'] for staff in sales]))
    return jsonify(staff_list)
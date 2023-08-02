import datetime
import jwt
from config import db
from flask import Blueprint, jsonify, request
#from decorators import jwt_required, manager_required, token_required
import PyPDF2
from config import db
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle


# All the api requests that start with auth will be guided here
# so if someone request auth/login then it direct them to this file and then
# search for the route /login
records = Blueprint('records', __name__)

@records.route("/<id>", methods=['GET'])
def see_records(id):
    # Get all sales from the Sales collection and turn into list
    curr_user = db.Accounts.find_one({"_id": id})
    if curr_user["role"] == "manager":
        name = curr_user['full_name']
    elif curr_user["role"] == "staff":
        manager_id = curr_user['manager']
        name = db.Accounts.find_one({ "_id": manager_id})['full_name']
    else:
        return jsonify({"message": "Invalid role"}), 400 
    
    all_records = db.Sales.find({"manager_assigned": name})
    records_list = list(all_records)

    # Return error if no sales, else return list of records
    if not records_list:    
        return jsonify({"message": "You don't have any records"}), 404
    return jsonify(records_list), 200

@records.route("/download", methods=['GET'])
def records_download():
    # Create a new PDF file
    pdf = PyPDF2.PdfFileWriter()

    # Create a new page
    page = pdf.addBlankPage(width=500, height=500)

    #Retrieve sales data from CRM system
    sales_data = db.Sales.find({})
    records_list = list(sales_data)

    # Create a PDF document
    doc = SimpleDocTemplate("sales_report.pdf", pagesize=letter)

    # Define report content
    elements = []

    # Add a table with sales data
    table_data = [["Product Id", "Client", "Quantity Sold", "Date", "Sold By", "Revenue"]]
    print(records_list)
    for sale in records_list:
        row = [sale['product_id'], sale['client_id'] , sale['date_of_sale'],sale['sold_by'] ,sale['quantity_sold'],"$" +str(sale['revenue'])]
        
        table_data.append(row)

    table = Table(table_data)
    table.setStyle(TableStyle([('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                            ('FONTSIZE', (0, 0), (-1, 0), 14),
                            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                            ('GRID', (0, 0), (-1, -1), 1, colors.black)]))

    elements.append(table)

    # Build the PDF document
    doc.build(elements)

    return jsonify({"message": "successful"}), 200 
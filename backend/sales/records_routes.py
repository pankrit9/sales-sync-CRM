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

@records.route("/", methods=['GET'])
def see_records():
    
    all_records = db.Sales.find({})

    # convert Cursor type to list
    records_list = list(all_records)

    if not records_list:
        return jsonify({"message": "You don't have any records"})

    return jsonify(records_list)

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
    table_data = [["Customer", "Product", "Date", "Amount"]]

    for sale in sales_data:
        row = [sale['customer'], sale['product'], sale['date'], sale['amount']]
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


    return jsonify({"message": "Unsuccessful"}), 400 
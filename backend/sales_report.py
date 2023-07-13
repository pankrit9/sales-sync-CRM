import PyPDF2
from config import db
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle

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
table_data = [["Product Id", "Quantity Sold", "Date", "Sold By", "Client Id", "Revenue"]]
print(records_list)
for sale in records_list:
    row = [sale['product_id'], sale['quantity_sold'], sale['date_of_sale'],sale['sold_by'] , sale['client_id'], sale['revenue']]
    
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

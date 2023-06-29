from pymongo import MongoClient
import sys
#Account
client = MongoClient("mongodb+srv://avengers:endgame@crm.e8aut5k.mongodb.net/")

# this is our whole database
crm_db = client.CRM 

# this is getting inside our "Accounts" collection
accounts = crm_db.Accounts

members = crm_db.Members

products = crm_db.Products

new_product = {
    "name": sys.argv[1],
    "stock": sys.argv[2]
}
products.insert_one(new_product)



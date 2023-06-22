from pymongo import MongoClient
from flask_bcrypt import Bcrypt


# db is the CRM database
database_URL = "mongodb+srv://avengers:endgame@crm.e8aut5k.mongodb.net/"
client = MongoClient(database_URL)

db = client.CRM
# bcrypt is going to be used for password encryption
# https://www.geeksforgeeks.org/password-hashing-with-bcrypt-in-flask/
bcrypt = Bcrypt()
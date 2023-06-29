from pymongo import MongoClient
import sys
client = MongoClient("mongodb+srv://avengers:endgame@crm.e8aut5k.mongodb.net/")

# this is our whole database
crm_db = client.CRM

# this is getting inside our "Accounts" collection
accounts = crm_db.Accounts

members = crm_db.Members

new_users = [{
                "email": "55555555@qq.com",
                "first_name": "Dai",
                "last_name": "IAD",
                "password": "secure",
                "position": "CEO",
                "company": "Nene chicken"
            },
            {
                "email": "11111111@qq.com",
                "first_name": "FAke",
                "last_name": "IAD",
                "password": "secure",
                "position": "CEO",
                "company": "Nene chicken"
            },
            {
                "email": "22222222222@qq.com",
                "first_name": "ohnoooo",
                "last_name": "IAD",
                "password": "notsecure",
                "position": "CEO",
                "company": "Nene chicken"
            },
            ]
#members.insert_many(new_users)

#users_found = accounts.find_one({"email": "11111111@qq.com"})
#accounts.delete_one({"email" : "Alejandronoguchi@gmail.com"})
#print(users_found)

#for user in users_found:
 
#   print(user)


#user_found = members.find_one_and_delete({"email": "55555555@qq.com"})
#print(user_found)
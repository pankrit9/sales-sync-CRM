import jwt 


def decode_jwt(encoded_jwt):
    success = True
    try:
        decrypted = jwt.decode(encoded_jwt, SECRET, algorithms=['HS256'])
    except:
        success = False
    #if success == False:
    #    raise AccessError(description='Could not decode token')
    return decrypted


def add_customer(name, age,email,phone, members):

    customer_temp = {
        "name" : name,
        "age" : age,
        "email" : email,
        "phone" : phone

    }
    inserted_id = members.insert_one(customer_temp).inserted_id
    print(inserted_id)
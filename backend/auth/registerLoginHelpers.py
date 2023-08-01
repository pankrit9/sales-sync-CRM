import re
from email.message import EmailMessage
import ssl
import smtplib
import random
import string
from flask import jsonify

# Checks user's email to see whether it is valid or not
def check_email_password(email, password):
    # Regular expression for validating an email
    regex = r'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'
    
    # Email length cannot be 0 or greater than 254
    if len(email) == 0 or len(email) > 254:
        return jsonify({'message': "Invalid email length"}), 422
    
    # Checks if invalid email format
    if not re.fullmatch(regex, email):
        return jsonify({'message': "Invalid email format"}), 422
    
    # Check the lenght
    if len(password) < 8:
        return jsonify({'message': "Password cannot be less than 8 characters"}), 422  

def recovery_email(receiver_email, bcrypt):
    company_email = 'salesyncrm@gmail.com'
    email_password = 'rjwvvnyemqwquzss'

    subject = "Salesync password reset"
    body = "The recovery code for your Salesync account is: "

    #create a random string that is going to be the code 
    result_str = ''.join(random.choice(string.ascii_letters) for i in range(20))

    # Encrypt the randomly generated code so we can store the encrypted code in the database
    encoded_password = bcrypt.generate_password_hash(result_str).decode('utf-8')

    em = EmailMessage()
    em['From'] = company_email
    em['To'] = receiver_email
    em['Subject'] = subject
    em.set_content(body+result_str)
    context = ssl.create_default_context()

    with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as smtp:
        smtp.login(company_email,email_password)
        smtp.sendmail(company_email, receiver_email, em.as_string())
        smtp.close()
    return encoded_password

# Checks if length of user's first and last name is not between 1 and 50 characters inclusive (invalid)
def check_name(name):
    if len(name) < 1 or len(name) > 50:
        return jsonify({'message': "Invalid name length"}), 422


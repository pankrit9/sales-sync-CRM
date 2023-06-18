import re
# Checks user's email to see whether it is valid or not
def check_email(email):
    # Regular expression for validating an email
    regex = r'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'
    
    # Email length cannot be 0 or greater than 254
    if len(email) == 0 or len(email) > 254:
        raise Exception(description='Invalid email length')
    
    # Checks if invalid email format
    if not re.fullmatch(regex, email):
        raise Exception(description='Invalid email format')

# Checks if an email address is already being used by another user
def check_duplicate_email(email, store):
    for user in store['users']:
        if user['email'] == email:
            raise Exception(description= 'The given email is already taken')

# Checks if user's password less than 6 characters (invalid)
def check_password_lenght(password):
    if len(password) < 8:
        raise Exception(description='Password cannot be less than 8 characters')

# Checks if length of user's first and last name is not between 1 and 50 characters inclusive (invalid)
def check_name(name):
    if len(name) < 1 or len(name) > 50:
        raise Exception(description='Invalid name length')

# Check data_store to see if generated handle is already in use
# Return True if handle is already in use, otherwise return False
def check_duplicate_handle(handle_str, store):
    for user in store['users']:
        if user['handle_str'] == handle_str:
            return True
    return False

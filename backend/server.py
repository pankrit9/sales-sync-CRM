import jwt
from flask import Flask, request, jsonify
from functools import wraps
from config import bcrypt
from flask_cors import CORS
from auth.auth_routes import auth
from tasks.tasks_routes import tasks
from products.products_routes import products
from sales.records_routes import records
from clients.clients_routes import clients
from sales.sales_routes import sales

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'Avengers'

SECRET_JWT = 'salesync'

bcrypt.init_app(app)

# Blueprints
app.register_blueprint(auth, url_prefix="/auth")
app.register_blueprint(products, url_prefix="/products")
app.register_blueprint(records, url_prefix="/records")
app.register_blueprint(tasks, url_prefix="/tasks")
app.register_blueprint(sales, url_prefix="/sales")
app.register_blueprint(clients, url_prefix="/clients")

# Wrapper function that is called before accessing any route 
# that requires authentication.
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.args.get('token')
        if not token:
            return jsonify({'message': 'Token not found'}), 404
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'])
        except:
            return jsonify({'message': 'Token is invalid'}), 401
        return f(data, *args, **kwargs)
    return decorated

@app.route("/", methods=['GET'])
def home():
    return

if __name__ == '__main__':
    app.run(debug=True)
# RECOMMENDATION if production env: Flask application should be run using a production-grade WSGI server such as Gunicorn or uWSGI
# Import necessary libraries and modules
from bson.objectid import ObjectId
from flask import Flask, request, jsonify, redirect, url_for
from pymongo import MongoClient
from flask_cors import CORS

import usersDatabase as udb
import hardwareDatabase as hwdb
import projectsDatabase as pdb

# Define the MongoDB connection string
MONGODB_SERVER = "mongodb+srv://srinivasanvarun:y7gj4{1}90vr5s@cluster0.ewrndcu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(MONGODB_SERVER)
webapp = client['WebApp']
users = webapp['Users']
projects = webapp['Projects']
hardware = webapp['Hardware']

# Initialize a new Flask web application
app = Flask(__name__)
CORS(app)
# Route for user login
@app.route('/login', methods=['POST'])
def login():
    # Extract data from request
    data = request.json
    userId = data['username']
    username = data['userId']
    password = data['password']
    isLogin = data['isLogin']
    res = udb.login(users, username, userId, password) if isLogin == 1 else udb.addUser(users, username, userId, password)

    if res == "success":
        return redirect(url_for('mainPage'))
    
    # Return a JSON response
    return jsonify({"res": res})

# Route for the main page (Work in progress)
@app.route('/main')
def mainPage():
    # Extract data from request

    # Connect to MongoDB

    # Fetch user projects using the usersDB module

    # Close the MongoDB connection

    # Return a JSON response
    return jsonify({})

# Route for joining a project
@app.route('/join_project', methods=['POST'])
def join_project():
    # Extract data from request

    # Connect to MongoDB

    # Attempt to join the project using the usersDB module

    # Close the MongoDB connection

    # Return a JSON response
    return jsonify({})

# Route for adding a new user
@app.route('/add_user', methods=['POST'])
def add_user():
    # Extract data from request

    # Connect to MongoDB

    # Attempt to add the user using the usersDB module

    # Close the MongoDB connection

    # Return a JSON response
    return jsonify({})

# Route for getting the list of user projects
@app.route('/get_user_projects_list', methods=['POST'])
def get_user_projects_list():
    # Extract data from request

    # Connect to MongoDB

    # Fetch the user's projects using the usersDB module

    # Close the MongoDB connection

    # Return a JSON response
    return jsonify({})

# Route for creating a new project
@app.route('/create_project', methods=['POST'])
def create_project():
    # Extract data from request

    # Connect to MongoDB

    # Attempt to create the project using the projectsDB module

    # Close the MongoDB connection

    # Return a JSON response
    return jsonify({})

# Route for getting project information
@app.route('/get_project_info', methods=['POST'])
def get_project_info():
    # Extract data from request

    # Connect to MongoDB

    # Fetch project information using the projectsDB module

    # Close the MongoDB connection

    # Return a JSON response
    return jsonify({})

# Route for getting all hardware names
@app.route('/get_all_hw_names', methods=['POST'])
def get_all_hw_names():
    # Connect to MongoDB

    # Fetch all hardware names using the hardwareDB module

    # Close the MongoDB connection

    # Return a JSON response
    return jsonify({})

# Route for getting hardware information
@app.route('/get_hw_info', methods=['POST'])
def get_hw_info():
    # Extract data from request

    # Connect to MongoDB

    # Fetch hardware set information using the hardwareDB module

    # Close the MongoDB connection

    # Return a JSON response
    return jsonify({})

# Route for checking out hardware
@app.route('/check_out', methods=['POST'])
def check_out():
    # Extract data from request

    # Connect to MongoDB

    # Attempt to check out the hardware using the projectsDB module

    # Close the MongoDB connection

    # Return a JSON response
    return jsonify({})

# Route for checking in hardware
@app.route('/check_in', methods=['POST'])
def check_in():
    # Extract data from request

    # Connect to MongoDB

    # Attempt to check in the hardware using the projectsDB module

    # Close the MongoDB connection

    # Return a JSON response
    return jsonify({})

# Route for creating a new hardware set
@app.route('/create_hardware_set', methods=['POST'])
def create_hardware_set():
    # Extract data from request

    # Connect to MongoDB

    # Attempt to create the hardware set using the hardwareDB module

    # Close the MongoDB connection

    # Return a JSON response
    return jsonify({})

# Route for checking the inventory of projects
@app.route('/api/inventory', methods=['GET'])
def check_inventory():
    # Connect to MongoDB

    # Fetch all projects from the HardwareCheckout.Projects collection

    # Close the MongoDB connection

    # Return a JSON response
    return jsonify({})

# Main entry point for the application

@app.route('/data')
def testing():
    return {
        'first_name': 'Varun',
        'last_name': 'Srinivasan'
    }

if __name__ == "__main__":
    
    # config = configparser.ConfigParser()
    # config.read(os.path.abspath(os.path.join("server/.ini")))
    # app.config['DEBUG'] = True
    # app.config['MONGO_URI'] = config['PROD']['DB_URI']

    app.run()


# Import necessary libraries and modules
from bson.objectid import ObjectId
from flask import Flask, request, jsonify, session, redirect, url_for
from pymongo import MongoClient
from flask_cors import CORS
import os
import json

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
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "https://orangehardware.netlify.app", "http://localhost:5000"]}}, supports_credentials=True)
app.secret_key = 'new_sk'
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = True  # Use True if using HTTPS


# Route for user login
# Remove 'GET' from the methods
@app.route('/login', methods=['POST'])
def login():
    # Extract data from request
    data = request.json
    username = data.get('username')
    userId = data.get('userId')
    password = data.get('password')
    isLogin = data.get('isLogin', 0)
    
    # Handle login or user registration
    if isLogin == 1:
        res = udb.login(users, username, userId, password)
    else:
        res = udb.addUser(users, username, userId, password)
    
    if res == "success":
        session['userId'] = userId
        print(session)
    
    # Return a JSON response
    return jsonify({"res": res})

# Route for the main page (Work in progress)
# this is for showing projects
@app.route('/main', methods=['GET'])
def mainPage():
    print(session)
    if 'userId' not in session:
        return jsonify({"error": "Unauthorized"}), 401
    
    user_projects = [
        pdb.queryProject(projects, p)
        for p in udb.getUserProjectsList(users, session['userId'])
    ]
    hw1 = hwdb.queryHardwareSet(hardware, "HWSet1")["availability"]
    hw2 = hwdb.queryHardwareSet(hardware, "HWSet2")["availability"]

    # Remove _id field, since it's useless and not serializable with jsonify
    projs = [{x: p[x] for x in p if x != '_id'} for p in user_projects]
    print(projs)
    return jsonify({'projects': projs, 'hw1': hw1, 'hw2': hw2})

# Route for joining a project
@app.route('/joinProject/<projectid>', methods=['GET'])
def join_project(projectid):
    return jsonify({"pid": f"{projectid}"})
    # Extract data from request

    # Connect to MongoDB

    # Attempt to join the project using the usersDB module

    # Close the MongoDB connection

    # Return a JSON response
    return jsonify({})

@app.route('/leaveProject/<projectid>', methods=['GET'])
def leaveProject(projectid):
    return jsonify({"pid": f"{projectid}"})


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
@app.route('/get_user_projects_list', methods=['GET'])
def get_user_projects_list():
    # Extract data from request

    # Connect to MongoDB

    # Fetch the user's projects using the usersDB module

    # Close the MongoDB connection

    # Return a JSON response
    return jsonify({})

# Route for creating a new project
@app.route('/create_project/<pid>', methods=['GET'])
def create_project(pid):
    # Extract data from request

    # Connect to MongoDB

    # Attempt to create the project using the projectsDB module

    # Close the MongoDB connection

    # Return a JSON response
    return jsonify({"pid": f"{pid}"})


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
@app.route('/checkOut_hardware/<projectId>/<qty>', methods=['GET'])
def check_out(projectId, qty):
    return jsonify({"qty": f"{qty}", "pid": f"{projectId}"})
    # Extract data from request

    # Connect to MongoDB

    # Attempt to check out the hardware using the projectsDB module

    # Close the MongoDB connection

    # Return a JSON response
    return jsonify({})

# Route for checking in hardware
@app.route('/checkIn_hardware/<projectId>/<qty>', methods=['GET'])
def check_in(projectId, qty):
    return jsonify({"qty": f"{qty}", "pid": f"{projectId}"})
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



'''
if __name__ == "__main__":
    
    # config = configparser.ConfigParser()
    # config.read(os.path.abspath(os.path.join("server/.ini")))
    # app.config['DEBUG'] = True
    # app.config['MONGO_URI'] = config['PROD']['DB_URI']

    app.run()

'''
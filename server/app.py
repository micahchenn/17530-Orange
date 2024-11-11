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
CORS(app)
app.secret_key = 'my_secret1'
# Route for user login
@app.route('/login', methods=['POST'])
def login():
    # Extract data from request
    data = request.json
    username = data['username']
    userId = data['userId']
    password = data['password']
    isLogin = data['isLogin']
    res = udb.login(users, username, userId, password) if isLogin == 1 else udb.addUser(users, username, userId, password)
    session['userId'] = userId
    print(session)
    
    # Return a JSON response
    return jsonify({"res": res})

# Route for the main page
# this is for showing projects
@app.route('/main')
def mainPage():
    print(session)
    if 'userId' not in session:
        return redirect(url_for('login'))
    user_projects = [pdb.queryProject(projects, p) for p in udb.getUserProjectsList(users, session['userId'])]
    
    # remove _id field, since it's useless and not serializable with jsonify
    res = [{x: p[x] for x in p if x != '_id'} for p in user_projects]
    print(res)
    return jsonify({'res': res})

# Route for joining a project
@app.route('/joinProject/<projectid>', methods=['POST'])
def join_project(projectid):
    message = udb.addProject(webapp,  session['userId'], projectid)
    return jsonify({'pid': projectid, "message": message})


# Route for leaving project
@app.route('/leaveProject/<projectid>', methods=['GET'])
def leaveProject(projectid):
    message = udb.leaveProject(webapp,  session['userId'], projectid)
    return jsonify({'pid': projectid, "message": message})


# Route for creating a new project
@app.route('/create_project/<pid>', methods=['GET'])
def create_project(pid):
    # Extract data from request
    print(session)
    message = pdb.createProject(projects, "", pid, "", session['userId'])
    print(message)
    return jsonify({"pid": f"{pid}", "message":message})


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
@app.route('/checkOut_hardware/<hwId>/<projectId>/<qty>', methods=['GET'])
def check_out(hwId, projectId, qty):
    message = pdb.checkOutHW(webapp, projectId, hwId, qty)
    return jsonify({"qty": f"{qty}", "pid": f"{projectId}", 'message': message})


# Route for checking in hardware
@app.route('/checkIn_hardware/<hwId>/<projectId>/<qty>', methods=['GET'])
def check_in(hwId, projectId, qty):
    message = pdb.checkInHW(webapp, projectId,hwId, qty)
    return jsonify({"qty": f"{qty}", "pid": f"{projectId}", 'message': message})


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
if __name__ == "__main__":
    app.run()

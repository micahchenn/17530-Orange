# Import necessary libraries and modules
from bson.objectid import ObjectId
from flask import Flask, request, jsonify, session, redirect, url_for, send_from_directory
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
app = Flask(__name__, static_folder='build/', static_url_path='/')
CORS(app, supports_credentials=True)
app.secret_key = 'new_sk'
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = True  # Use True if using HTTPS
app.config['SERVER_NAME'] = "app-orange-hardware-b474fc6fdc47.herokuapp.com"
#app.config['SERVER_NAME'] = 'localhost:5000'

@app.route('/login', methods=['POST'])
def login():
    # Extract data from request
    session.clear()
    data = request.json
    username = data['username']
    userId = data['userId']
    password = data['password']
    isLogin = data['isLogin']
    res = udb.login(users, username, userId, password) if isLogin == 1 else udb.addUser(users, username, userId, password)
    session['userId'] = userId
    print(session)
    
    return jsonify({"res": res})


# Route for the main page
@app.route('/getInfo', methods=['GET'])
def mainPage():
    print(session)
    user_projects = [pdb.queryProject(projects, p) for p in udb.getUserProjectsList(users, session['userId'])]
    hw1 = hwdb.queryHardwareSet(hardware, "HWSet1")["availability"]
    hw2 = hwdb.queryHardwareSet(hardware, "HWSet2")["availability"]

    # remove _id field, since it's useless and not serializable with jsonify
    projs = [{x: p[x] for x in p if x != '_id'} for p in user_projects]
    print(projs)
    return jsonify({'projects': projs, 'hw1': hw1, 'hw2': hw2})

# Route for joining a project
@app.route('/joinProject/<projectid>', methods=['POST', 'GET'])
def join_project(projectid):
    message = udb.joinProject(webapp,  session['userId'], projectid)
    return jsonify({'pid': projectid, "message": message})


# Route for leaving project
@app.route('/leaveProject/<projectid>', methods=['GET'])
def leaveProject(projectid):
    message = udb.leaveProject(webapp,  session['userId'], projectid)
    return jsonify({'pid': projectid, "message": message})


# Route for creating a new project
@app.route('/create_project/<pid>', methods=['POST'])
def create_project(pid):
    data = request.json
    desc = data["description"]
    print(session)
    message = pdb.createProject(webapp, pid, pid, desc, session['userId'])
    print(message)
    return jsonify({"pid": f"{pid}", "message":message})


# Route for getting project information
@app.route('/logout', methods=['GET'])
def logout():
    session.clear()
    return jsonify({'message': 'ok'})


# Route for checking out hardware
@app.route('/checkOut_hardware/<hwId>/<projectId>/<qty>', methods=['GET', 'FETCH'])
def check_out(hwId, projectId, qty):
    message = pdb.checkOutHW(webapp, projectId, hwId, int(qty))
    return jsonify({"qty": f"{qty}", "pid": f"{projectId}", 'message': message})


# Route for checking in hardware
@app.route('/checkIn_hardware/<hwId>/<projectId>/<qty>', methods=['GET', 'FETCH'])
def check_in(hwId, projectId, qty):
    message = pdb.checkInHW(webapp, projectId,hwId, int(qty))
    return jsonify({"qty": f"{qty}", "pid": f"{projectId}", 'message': message})

@app.route('/')
@app.route('/main')
def serve_react():
    print('\n\n\n\nWE GET TO MAIN\n\n\n\n')
    return send_from_directory(app.static_folder, 'index.html')


# Main entry point for the application
if __name__ == "__main__":
    app.run()

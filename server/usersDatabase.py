# Import necessary libraries and modules
from pymongo import MongoClient
'''
Structure of User entry:
User = {
    'username': username,
    'userId': userId,
    'password': password,
    'projects': [project1_ID, project2_ID, ...]
}
'''

# Function to add a new user
def addUser(users, username, userId, password):
    user = __queryUser(users, username, userId)
    if user is None:
        users.insert_one({"username": username, "userId": userId, "password": password, "projects": []})
        return "success"
    return "already_exists"
    

# Helper function to query a user by username and userId
def __queryUser(users, username, userId):
    return users.find_one({"username": username, "userId": userId})


# Function to log in a user
def login(users, username, userId, password):
    user = __queryUser(users, username, userId)
    if user is None:
        return "not_exists"
    
    return "wrong_pass" if user['password'] != password else "success"


# Function to add a user to a project
def joinProject(webapp, userId, projectId):
    user = webapp['Users'].find_one({"userId": userId})
    project = webapp['Projects'].find_one({"projectId": projectId})

    if user is None:
        return "invalid_user"

    if project is None:
        return "invalid project"

    if projectId in user['projects']:
        return "already_exists"
    
    user['projects'].append(projectId)
    project['users'].append(userId)
    return "success"


def leaveProject(webapp, userId, projectId):
    user = webapp['Users'].find_one({"userId": userId})
    project = webapp['Projects'].find_one({"projectId": projectId})

    if user is None:
        return "invalid_user"

    if project is None:
        return "invalid project"

    if projectId not in user['projects']:
        return 'project_not_exists'
    
    user['projects'].remove(projectId)
    project['users'].remove(userId)
    return "success"


# Function to get the list of projects for a user
def getUserProjectsList(users, userId):
    user = users.find_one({"userId": userId})
    return "invalid_user" if user is None else user['projects']



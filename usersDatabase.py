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
def encrypt(input_text, N, D):
    return ''.join([chr((ord(i) + (N%93)*D + 59)%93 + 34) for i in reversed(input_text)])

# Function to add a new user
def addUser(users, username, userId, password):
    user = __queryUser(users, username, userId)
    if user is None:

        if userId == '' or ' ' in userId:
            return "invalid_username"
    
        if password == '' or ' ' in password:
            return 'invalid_pass'
    
        users.insert_one({"username": username, "userId": userId, "password": encrypt(password, 1, 3), "projects": []})
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

    if userId == '' or ' ' in userId:
        return "invalid_username"
    
    if password == '' or ' ' in password:
        return 'invalid_pass'
    
    return "wrong_pass" if user['password'] != encrypt(password, 1, 3) else "success"


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
    

    webapp['Users'].update_one({'userId': userId}, {'$push': {'projects': projectId}})
    webapp['Projects'].update_one({'projectId': projectId}, {'$push': {'users': userId}})
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
    
    webapp['Users'].update_one({'userId': userId}, {'$pull': {'projects': projectId}})
    webapp['Projects'].update_one({'projectId': projectId}, {'$pull': {'users': userId}})
    return "success"


# Function to get the list of projects for a user
def getUserProjectsList(users, userId):
    user = users.find_one({"userId": userId})
    return "invalid_user" if user is None else user['projects']



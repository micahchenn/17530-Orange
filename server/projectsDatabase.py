# Import necessary libraries and modules
from pymongo import MongoClient
import usersDatabase
'''
Structure of Project entry:
Project = {
    'projectName': projectName,
    'projectId': projectId,
    'description': description,
    'hwSets': {HW1: 0, HW2: 10, ...},
    'users': [user1, user2, ...]
}
'''

# Function to query a project by its ID
def queryProject(projects, projectId):
    return projects.find_one({"projectId": projectId})
    

# Function to create a new project
def createProject(webapp, projectName, projectId, description, userId):
    project = queryProject(webapp['Projects'], projectId)
    user = webapp['Users'].find_one({"userId": userId})
    
    if project is None:
        webapp['Projects'].insert_one({
            "projectName": projectName, 
            "projectId": projectId, 
            "description": description, 
            "hwSets": {'HWSet1': 0, 'HWSet2': 0}, 
            "users": [userId], 
            'auth': [userId]
            })
        
        webapp['Users'].update_one({'userId': userId}, {'$push': {'projects': projectId}})
        return "success"

    return "already_exists"


# Function to add a user to a project
# def authUser(webapp, projectId, userId):
#     project = queryProject(webapp['Projects'], projectId)
#     user = webapp['Users'].find_one({"userId": userId})

#     if project is None:
#         return "invalid_project"
    
#     if user is None:
#         return "invalid_user"
    
#     if userId in project['users']:
#         return "already_exists"
    
#     project['auth'].append(userId)
#     user['projects'].append(projectId)
#     return "success"


# Function to update hardware usage in a project
def updateUsage(webapp, projectId, hwSetName):
    project = queryProject(webapp['Projects'], projectId)
    
    if project['hwSets'][hwSetName] == 0:
        project['hwSets'].pop(hwSetName)

    return "success"

# Function to check out hardware for a project
def checkOutHW(webapp, projectId, hwSetName, qty):
    project = queryProject(webapp['Projects'], projectId)
    hw = webapp['Hardware'].find_one({"hwName": hwSetName})

    if project is None:
        return "invalid_project"
    
    if hw is None:
        return "invalid_hw"
    
    if qty > hw['availability']:
        return "qty_err"
    
    if hwSetName not in project['hwSets']:
        project['hwSets'][hwSetName] = 0

    #project['hwSets'][hwSetName] += qty
    #hw['availability'] -= qty
    webapp['Projects'].update_one({'projectId': projectId}, {'$set': {
        f'hwSets.{hwSetName}': project['hwSets'][hwSetName] + qty}})
    
    webapp['Hardware'].update_one({'hwName': hwSetName}, {'$set': {'availability': hw['availability'] - qty}})

    return "success"
    

# Function to check in hardware for a project
def checkInHW(webapp, projectId, hwSetName, qty):
    project = queryProject(webapp['Projects'], projectId)
    hw = webapp['Hardware'].find_one({"hwName": hwSetName})

    if project is None:
        return "invalid_project"
    
    if hw is None:
        return "invalid_hw"
    
    if hwSetName not in project['hwSets']:
        return "not_exists"
    
    if qty > project['hwSets'][hwSetName]:
        return "qty_err"


    webapp['Projects'].update_one({'projectId': projectId}, {'$set': {
        f'hwSets.{hwSetName}': project['hwSets'][hwSetName] - qty}})
    
    webapp['Hardware'].update_one({'hwName': hwSetName}, {'$set': {'availability': hw['availability'] + qty}})
    return updateUsage(webapp, projectId, hwSetName)

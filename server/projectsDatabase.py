# Import necessary libraries and modules
from pymongo import MongoClient

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
def createProject(projects, projectName, projectId, description):
    project = queryProject(projects, projectId)
    if project is None:
        projects.insert_one({"projectName": projectName, "projectId": projectId, "description": description, "hwSets": {}, "users": []})
        return "success"

    return "already_exists"


# Function to add a user to a project
def addUser(webapp, projectId, userId):
    project = queryProject(webapp['Projects'], projectId)
    user = webapp['Users'].find_one({"userId": userId})

    if project is None:
        return "invalid_project"
    
    if user is None:
        return "invalid_user"
    
    if userId in project['users']:
        return "already_exists"
    
    project['users'].append(userId)
    user['projects'].append(projectId)
    return "success"


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
    
    if qty > hw['capacity']:
        return "qty_err"
    
    if hwSetName not in project['hwSets']:
        project['hwSets'][hwSetName] = 0

    project['hwSets'][hwSetName] += qty
    hw['availability'] -= qty
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

    project['hwSets'][hwSetName] -= qty
    hw['availability'] += qty
    return updateUsage(webapp, projectId, hwSetName)



# Import necessary libraries and modules
from pymongo import MongoClient

'''
Structure of Hardware Set entry:
HardwareSet = {
    'hwName': hwSetName,
    'capacity': initCapacity,
    'availability': initCapacity
}
'''

# Function to create a new hardware set
def createHardwareSet(hardware, hwSetName, initCapacity):
    hw = queryHardwareSet(hardware, hwSetName)

    if hw is None:
        return "invalid_hw"
    
    hardware.insert_one({"hwName": hwSetName, "capacity": initCapacity, "availability": initCapacity})
    return "success"
    

# Function to query a hardware set by its name
def queryHardwareSet(hardware, hwSetName):
    return hardware.find_one({"hwName": hwSetName})


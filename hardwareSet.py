# Class for hardware set
class hardwareSet:
    def __init__(self):
        self.__capacity = 0
        self.__availability = 0
        self.__CheckedOut = [0] * 1000
    
    def initialize_capacity(self, n):
        self.__capacity = n
        self.__availability = n

    def check_in(self, n, id):
        if (n > self.__CheckedOut[id]): 
            return -1
        else:
            self.__CheckedOut[id] -= n
            self.__availability += n
            return 0
    
    def check_out(self, n, id):
        if (self.__availability - n <= 0): 
            self.__CheckedOut[id] += self.__availability
            self.__availability = 0
            return -1
        else:
            self.__CheckedOut[id] += n
            self.__availability -= n
            return 0

    def get_availability(self):
        return self.__availability

    def get_capacity(self):
        return self.__capacity

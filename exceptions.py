
class NotPreparedException(Exception):
    def __init__(self, message='Data is not prepared'):
        super().__init__(message)

class UnableToPredictUserCluster(Exception):
    def __init__(self, message='Unable to predict user cluster'):
        super().__init__(message)

from abc import ABC


class Api(ABC):
    def __init__(self,app):
        self.app =app
        self.exposeApi()
        super().__init__()


    def exposeApi(self):
        pass    
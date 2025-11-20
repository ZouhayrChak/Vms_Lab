from .Api import Api
from .Config import *
from flask import request
import subprocess
from subprocess import CalledProcessError

BRIDGE_URL = BASE_URL + "/sb"

class SessionBridge(Api):
    def __init__(self,app):
        super().__init__(app)


    def exposeApi(self):
        @self.app.route(BRIDGE_URL,methods=["POST"])
        def createSessionBridge():
            sb_data = request.get_json()
    
            try:
                subnet = sb_data['bridgeIp'].split('.')[ : -1]
                subnet.append('0')
                subnet = '.'.join(subnet)
                subprocess.check_call(f"""
                    docker network create \
                    --driver=bridge --subnet={subnet}/24 \
                    -o 'com.docker.network.bridge.name'='sbr{sb_data['idSb']}'
                    sbr{sb_data['idSb']} """.split())

                response = {"message":"session bridge created","success":True},201 
            except CalledProcessError:
                response = {"message":"session bridge cannot be created","success":False},404
                
            return response


        @self.app.route(f"{BRIDGE_URL}/<string:idSb>",methods=["DELETE"])
        def deleteSessionBridge(idSb:str):
            try:
                subprocess.check_call(f"docker network rm sbr{idSb}".split())
                response = {"message":"session bridge deleted","success":True},200
            except CalledProcessError:
                print(f"bridge sbr{idSb} cannot be deleted")
                response = {"message":"session bridge not deleted","success":False},404
            return response
                
        





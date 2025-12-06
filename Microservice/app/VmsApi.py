from .Api import Api
from .Config import BASE_URL
from flask import request
from .NatBridge import NatBridge
import subprocess
from subprocess import CalledProcessError


VM_URL = BASE_URL + "/vm"

class Vm(Api):
    def __init__(self,app):
        self.app = app
        self.exposeApi()

    def exposeApi(self):
        @self.app.route(VM_URL+"/",methods=["POST"])
        def createVm():
            vm_data = request.get_json()
            print(vm_data)
            natBridge = NatBridge()
            nb_data =dict(idNb=vm_data['idNb'],natIp=vm_data['natIp'],idSb=vm_data['idSb'])

            natBridge.createNatBridge(nb_data)
            try:
                subprocess.check_call(f"docker run --name={vm_data['nameVm']} --net=sbr{vm_data['idSb']} --ip={vm_data['ipVm']} --rm --privileged -d docker:dind".split())
                subprocess.check_call(f"docker network connect nbr{vm_data['idSb']}{vm_data['idNb']} {vm_data['nameVm']}".split())
                response = {"message":"vm created","success":True},201
            except Exception:
                subprocess.check_call(f"docker network rm nbr{vm_data['idSb']}{vm_data['idNb']}".
                split())
                subprocess.check_call(f"docker rm -f {vm_data['nameVm']}".split())
                response = {"message":"could not create vm","success":False},404
            return response

        @self.app.route(VM_URL+"/",methods=["DELETE"])
        def deleteVm():
            try:
                data = request.get_json()
                subprocess.check_call(f"docker stop {data['nameVm']}".split())
                subprocess.check_call(f"docker network rm nbr{data['idNb']}".split())


                response = {"message":"vm deleted","success":True},200
            except Exception:
                print(f"vm {data['nameVm']} cannot be deleted")
                response = {"message":"could not delete vm","success":False}
            return response,404






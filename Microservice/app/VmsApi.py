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
        @self.app.route(VM_URL,methods=["POST"])
        def createVm():
            vm_data = request.get_json()
            print(vm_data)
            natBridge = NatBridge()
            nb_data =dict(idNb=vm_data['idNb'],natIp=vm_data['natIp'],idSb=vm_data['idSb'])

            natBridge.createNatBridge(nb_data)
            try:
                subprocess.check_call(f"docker run --name={vm_data['nameVm']} --net=sbr{vm_data['idSb']} --ip={vm_data['ipVm']} --rm -itd ubuntu".split())                
                subprocess.check_call(f"docker network connect nbr{vm_data['idSb']}{vm_data['idNb']} {vm_data['nameVm']}".split())
                response = {"message":"vm created","success":True},201
            except Exception:
                subprocess.check_call(f"docker network rm nbr{vm_data['idSb']}{vm_data['idNb']}".
                split())
                subprocess.check_call(f"docker rm -f {vm_data['nameVm']}".split())
                response = {"message":"could not create vm","success":False},404
            return response

        @self.app.route(VM_URL,methods=["DELETE"])
        def deleteVm():
            try:
                data = request.get_json()
                print(data)
                subprocess.check_call(f"docker stop {data['nameVm']}".split())
                print("vm deleted")
                subprocess.check_call(f"docker network rm nbr{data['idSb']}{data['idNb']}".split())
                print("nb deleted")

                response = {"message":"vm deleted","success":True},200
            except Exception:
                print(f"vm {data['nameVm']} cannot be deleted")
                response = {"message":"could not delete vm","success":False},404
            return response
        
        @self.app.route(VM_URL + '/all', methods=["DELETE"])
        def deleteAll():
            try:
                data = request.get_json()
                print(data)

                cmd_stop = f"docker stop $(docker ps -q -f network=sbr{data['idSb']})"
                subprocess.check_call(cmd_stop, shell=True)

                cmd_rm_nb = f"docker network rm $(docker network ls -f name=nbr{data['idSb']}* -q)"
                subprocess.check_call(cmd_rm_nb, shell=True)


                cmd_rm = f"docker network rm sbr{data['idSb']}"
                subprocess.check_call(cmd_rm, shell=True)

                return {"message": "vms deleted", "success": True}, 200
            
            except CalledProcessError as e:
                return {"message": "no vms", "success": True}, 200


            except Exception as e:
                print(f"vms cannot be deleted: {e}")
                return {"message": "could not delete vms", "success": False}, 404







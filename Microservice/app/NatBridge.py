import subprocess
from subprocess import CalledProcessError
class NatBridge:
    def __init__(self):
        pass

    def createNatBridge(self,nb_data):   
        try:
            subnet = nb_data['natIp'].split('.')[ : -1]
            subnet.append('0')
            subnet = '.'.join(subnet)

            subprocess.check_call(f"""
                    docker network create \
                    --driver=bridge --subnet={subnet}/24 \
                    -o com.docker.network.bridge.name=nbr{nb_data['idNb']}
                    nbr{nb_data['idNb']}
                    """.split())
            

            response = {"message":"nat bridge created","success":True} 
        except CalledProcessError:
            response = {"message":"nat bridge cannot be created","success":False}
        return response
    
    def deleteNatBridge(self,idNb:str):
        try:
            subprocess.check_call(f"docker network rm nbr{idNb}".split())
            response = {"message":"nat bridge deleted","success":True}
        except CalledProcessError:
            print(f"bridge br{idNb} cannot be deleted")
            response = {"message":"nat bridge not deleted","success":False}
        return response

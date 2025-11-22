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
                    nbr{nb_data['idSb']}{nb_data['idNb']}
                    """.split())
        except Exception:
            raise Exception("Could not create nat bridge")
    
    def deleteNatBridge(self,idNb,idSb):
        try:
            subprocess.check_call(f"docker network rm nbr{idSb}{idNb}".split())
            response = {"message":"nat bridge deleted","success":True}
        except Exception:
            raise Exception("Could not delete nat bridge")

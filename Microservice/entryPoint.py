from flask import Flask
from flask_cors import CORS
from app import SessionBridge,Vm
import os



app = Flask(__name__)
backend = f"{os.getenv('BACKEND_IP','http://127.0.0.1:8080')}"
CORS(app)

sessionBridge = SessionBridge(app)
vm = Vm(app)



if __name__ == "__main__":
    app.run("0.0.0.0",8000)
import { useEffect, useState } from "react";
import Header from "../Components/Header";
import SideBar from "../Components/SideBar";
import Vm from '../Components/Vm'
import '../styles/userLab.css'
import { createSessionBridge } from "../services/BridgeApi";
import { toast } from "sonner";
import type { DetailVm } from "../utils/config";


const UserLab: React.FC = () => {
    const [selectedVm,setSelectedVm] = useState<DetailVm >({
        idVm : 0,
        idSb: 0,
        idNb: 0,
        nameVm: '',
        ipVm: '',
        natIp: ''
     });

    


    useEffect(()=>{
        
        const getSessionBridge = async () =>{
            if (!localStorage.getItem("idSb")){
                try{
                    const response = await createSessionBridge();
                    localStorage.setItem("idSb",response.idSb.toString());
                }catch(error:any){
                    toast.warning(error.message);
                }
            }
        
    }
    
        if (!localStorage.getItem("idSb"))
                getSessionBridge();

    },[])

    return (
        <div className="lab-container">
            <div id="header"> 
                <Header/>
            </div>
            <div className="body-container">
                <div id="side-bar">
                    <SideBar setSelectedVm={setSelectedVm} selectedVm={selectedVm}/>
                </div>
                <div className="s-t-container">
                    <Vm selectedVm={selectedVm}/>
                </div>
            </div>
        </div>
    )
}


export default UserLab;
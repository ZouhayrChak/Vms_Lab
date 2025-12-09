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
        nameVm: '',
        ipVm: '',
     });
     const [start,setStart] = useState(localStorage.getItem("idSb")? true : false);

    


    useEffect(()=>{
        
        const getSessionBridge = async () =>{
                try{
                    const response = await createSessionBridge();
                    if (!localStorage.getItem("idSb"))
                        localStorage.setItem("idSb",response.idSb.toString());
                    setStart(true);
                }catch(error:any){
                    toast.warning(error.message);
                }
        
    }
    
                getSessionBridge();

    },[])

    return (
        <div className="lab-container">
            <div id="header"> 
                <Header start={start}/>
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

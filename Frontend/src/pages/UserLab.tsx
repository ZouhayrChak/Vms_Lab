import { useEffect, useState } from "react";
import Header from "../Components/Header";
import SideBar from "../Components/SideBar";
import Vm from '../Components/Vm'
import '../styles/userLab.css'
import { createSessionBridge } from "../services/BridgeApi";
import { getVms } from "../services/VmsApi";
import { toast } from "sonner";
import type { DetailVm } from "../utils/config";

const UserLab: React.FC = () => {
    const [vms, setVms] = useState<DetailVm[]>([]);
    const [selectedVm, setSelectedVm] = useState<DetailVm>({
        idVm: 0, idSb: 0, idNb: 0, nameVm: '', ipVm: '', natIp: ''
    });
    const [start, setStart] = useState(localStorage.getItem("idSb") ? true : false);

    const fetchVms = async () => {
        try {
            const response = await getVms();
            setVms(response);
            if (response.length > 0 && selectedVm.idVm === 0) {
                setSelectedVm(response[0]);
            }
        } catch (error: any) {
            console.error(error.message);
        }
    };

    useEffect(() => {
        const initSession = async () => {
            try {
                const response = await createSessionBridge();
                if (!localStorage.getItem("idSb"))
                    localStorage.setItem("idSb", response.idSb.toString());
                setStart(true);
                fetchVms();
            } catch (error: any) {
                toast.warning(error.message);
            }
        };
        initSession();
    }, []);

    return (
        <div className="lab-container">
            <div id="header"> 
                <Header start={start}/>
            </div>
            <div className="body-container">
                <div id="side-bar">
                    <SideBar 
                        vms={vms} 
                        setVms={setVms} 
                        setSelectedVm={setSelectedVm} 
                        selectedVm={selectedVm}
                    />
                </div>
                <div className="s-t-container" style={{ position: 'relative', height: '100%' }}>
                    {vms.map((vm) => (
                        <div 
                            key={vm.idVm} 
                            style={{ 
                                display: selectedVm.idVm === vm.idVm ? "block" : "none",
                                height: '100%' 
                            }}
                        >
                            <Vm selectedVm={vm} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default UserLab;

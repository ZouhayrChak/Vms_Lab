import '../styles/SideBar.css'
import { toast } from "sonner";
import { createVm, deleteVm } from "../services/VmsApi";
import type { DetailVm } from "../utils/config";
import type { Dispatch, SetStateAction } from "react";

interface SideBarProps {
    vms: DetailVm[];
    setVms: Dispatch<SetStateAction<DetailVm[]>>;
    selectedVm: DetailVm;
    setSelectedVm: Dispatch<SetStateAction<DetailVm>>;
}

const SideBar: React.FC<SideBarProps> = ({ vms, setVms, selectedVm, setSelectedVm }) => {

    const createAVm = async () => {
        try {
            const sb = window.localStorage.getItem("idSb");
            if (sb) {
                const response = await createVm({ idSb: Number(sb), bridgeIp: '' });
                setVms(prev => [...prev, response]);
                setSelectedVm(response);
            }
        } catch (error: any) {
            toast.warning(error.message)
        }
    }

    const handleDeleteVm = async (idVm: number) => {
        try {
            await deleteVm({ idVm: idVm });
            const newList = vms.filter(vm => vm.idVm !== idVm);
            setVms(newList);

            if (newList.length >= 1) {
                setSelectedVm(newList[0]);
            } else {
                setSelectedVm({ idVm: 0, idSb: 0, idNb: 0, nameVm: '', ipVm: '', natIp: '' });
            }
        } catch (error: any) {
            toast.warning(error.message)
        }
    }

    return (
        <div className="vms">
            <div id="btn-create">
                <button onClick={createAVm}>Create Vm</button>
            </div>
            <div id="vms">
                {vms.map(vm =>
                    <div key={vm.idVm} id="vm">
                        <div id="vm-btns">
                            <button 
                                onClick={() => setSelectedVm(vm)} 
                                className={selectedVm.idVm === vm.idVm ? "btn-selected" : ''}
                            >
                                {vm.nameVm}<br/>{vm.ipVm}    
                            </button>
                            <button onClick={() => handleDeleteVm(vm.idVm)} id="trush">
                                <img src="/delete_24dp_1F1F1F_FILL0_wght400_GRAD0_opsz24.svg" alt="delete" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SideBar;

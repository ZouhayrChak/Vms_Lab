import { useEffect, useState } from "react";
import '../styles/SideBar.css'
import { toast } from "sonner";
import { createVm, getVms } from "../services/VmsApi";
import type { DetailVm } from "../utils/config";
import { deleteVm } from "../services/VmsApi";
import type { Dispatch, SetStateAction} from "react";



interface SideBarProps {
    selectedVm: DetailVm;
    setSelectedVm: Dispatch<SetStateAction<DetailVm>>;}


const SideBar: React.FC<SideBarProps> = (props) => {
    const [vms,setVms] = useState<DetailVm[]>([]); 


    const createAVm = async () => {
        try{
            const sb = window.localStorage.getItem("idSb");
            if (sb){
                const response = await createVm({idSb: Number(sb) , bridgeIp: ''});
                setVms(prev => [...prev, response]);
                props.setSelectedVm(response);
                
            }
            
        }catch(error:any){
            toast.warning(error.message)
        }

    }
    const handleDeleteVm = async (idVm: number) => {
                try{
                    await deleteVm({ idVm: idVm});
                    const newList = vms.filter(vm => vm.idVm !== idVm);
                    setVms(newList);
                    
                    if (newList.length >= 1 ){
                        props.setSelectedVm(newList[0]);
                    }
                    else{
                    props.setSelectedVm({
                            idVm : 0,
                            idSb: 0,
                            nameVm: '',
                            ipVm: '',
                         })
                        }
                    
                }catch(error:any){
                    toast.warning(error.message)
                }
    
            }

    const handleVmClick = (vm: DetailVm) => {
        props.setSelectedVm(vm);

    }

    useEffect(()=>{
        const getListVms = async () => {
            try{
                const response = await getVms();
                setVms(response);
            }catch(error:any){
                console.log(error.message);
            }
        } 

        if (localStorage.getItem("idSb"))
            getListVms();
    },[])

    return (
        <div className="vms">
            <div id="btn-create">
                <button onClick={createAVm}>Create Vm</button>
            </div>
            <div id="vms">
                {vms.map(vm=>
                    <div key={vm.idVm} id="vm">
                        <div id="vm-btns">
                            <button  onClick={() => handleVmClick(vm)} className={props.selectedVm.idVm == vm.idVm ? "btn-selected" : ''}>
                                {vm.nameVm}
                                    <br/>
                                {vm.ipVm}    
                            </button>
                            <button onClick={()=> handleDeleteVm(vm.idVm)}id="trush"><img src="/delete_24dp_1F1F1F_FILL0_wght400_GRAD0_opsz24.svg" alt="" /></button>
                        </div>
                        
                    </div>)
                }
            </div>

        
        </div>
    )
}


export default SideBar;

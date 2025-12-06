import Stats from "./Stats"
import Terminal from "./Terminal"
import '../styles/Vm.css'
import type { DetailVm } from "../utils/config"

interface VmProps {
    selectedVm: DetailVm
}

const Vm:React.FC<VmProps> = (props) => {

    return (
        <div className="terminal-vm-container">
            <div id="stats">
                <Stats nameVm={props.selectedVm?.nameVm} ipVm={props.selectedVm?.ipVm}/>
            </div>
            
            <div id="terminal">
                <Terminal selectedVm={props.selectedVm}/>
            </div>
        </div>
    )
}

export default Vm;

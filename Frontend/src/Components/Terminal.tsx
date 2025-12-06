import XTerminal from "./XTerminal";
import { useState, useEffect } from "react";
import { SOCKET_BASE_URL, type DetailVm } from "../utils/config";


interface TerminalProps{
  selectedVm: DetailVm
}

const Terminal:React.FC<TerminalProps> = (props) => {

  const [socket, setSocket] = useState<WebSocket>();
  
    useEffect(() => {
      const ws = new WebSocket(`${SOCKET_BASE_URL}/term?container=${props.selectedVm.nameVm}`);
      setSocket(ws);
  
      return () => ws.close();
    }, [props.selectedVm.nameVm]);
  
  
  return (
    <div className="terminal">
      {socket && <XTerminal socket={socket} />}
    </div>
  );
}

export default Terminal;

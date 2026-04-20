import XTerminal from "./XTerminal";
import { useState, useEffect } from "react";
import { SOCKET_BASE_URL, type DetailVm } from "../utils/config";

interface TerminalProps {
  selectedVm: DetailVm
}

const Terminal: React.FC<TerminalProps> = ({ selectedVm }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (!selectedVm.nameVm) return;

    const ws = new WebSocket(`${SOCKET_BASE_URL}/term?container=${selectedVm.nameVm}`);
    setSocket(ws);

    return () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    };
  }, []); // Only run once on mount for this specific VM instance

  return (
    <div className="terminal" style={{ height: '100%' }}>
      {socket && <XTerminal socket={socket} />}
    </div>
  );
}

export default Terminal;

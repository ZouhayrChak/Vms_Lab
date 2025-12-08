import { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

interface XTerminalProps {
  socket: WebSocket | null;
}

export default function XTerminal({ socket }: XTerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const term = useRef<Terminal | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);

  useEffect(() => {
    term.current = new Terminal({
      cursorBlink: true,
      theme: { background: "#1e1e1e" },
    });

    fitAddon.current = new FitAddon();
    term.current.loadAddon(fitAddon.current);

    term.current.open(terminalRef.current!);
    fitAddon.current.fit();

    // When user types, send to backend
    term.current.onData((data: string) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(data);
      }
    });

    // When backend sends data, print it
    if (socket) {
      socket.onmessage = (msg) => {
        term.current?.write(msg.data);
      };
    }

    // Resize when window changes
    const resizeHandler = () => fitAddon.current?.fit();
    window.addEventListener("resize", resizeHandler);

    return () => {
      term.current?.dispose();
      window.removeEventListener("resize", resizeHandler);
    };
  }, [socket]);

  return (
    <div
      ref={terminalRef}
      style={{ width: "100%", height: "100%", background: "#1e1e1e" , padding: '5px'}}
    ></div>
  );
}

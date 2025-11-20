import { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

export default function XTerminal({ socket }) {
  const terminalRef = useRef(null);
  const term = useRef(null);
  const fitAddon = useRef(null);

  useEffect(() => {
    term.current = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      theme: { background: "#1e1e1e" },
    });

    fitAddon.current = new FitAddon();
    term.current.loadAddon(fitAddon.current);

    term.current.open(terminalRef.current);
    fitAddon.current.fit();

    // When user types, send to backend
    term.current.onData((data) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(data);
      }
    });

    // When backend sends data, print it
    if (socket) {
      socket.onmessage = (msg) => {
        term.current.write(msg.data);
      };
    }

    // Resize when window changes
    window.addEventListener("resize", () => fitAddon.current.fit());

    return () => {
      term.current.dispose();
      window.removeEventListener("resize", () => fitAddon.current.fit());
    };
  }, [socket]);

  return (
    <div
      ref={terminalRef}
      style={{ width: "100%", height: "100%", background: "#1e1e1e" , padding: '5px'}}
    ></div>
  );
}

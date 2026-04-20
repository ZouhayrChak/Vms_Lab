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
    if (!terminalRef.current) return;

    term.current = new Terminal({
      cursorBlink: true,
      theme: { background: "#1e1e1e" },
    });

    fitAddon.current = new FitAddon();
    term.current.loadAddon(fitAddon.current);
    term.current.open(terminalRef.current);
    
    // Initial fit
    setTimeout(() => fitAddon.current?.fit(), 0);

    term.current.onData((data: string) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(data);
      }
    });

    if (socket) {
      socket.onmessage = (msg) => {
        term.current?.write(msg.data);
      };
    }

    const resizeHandler = () => {
      if (terminalRef.current && terminalRef.current.offsetHeight > 0) {
        fitAddon.current?.fit();
      }
    };

    window.addEventListener("resize", resizeHandler);

    // Watch for visibility changes to re-fit when selected
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fitAddon.current?.fit();
      }
    });
    observer.observe(terminalRef.current);

    return () => {
      term.current?.dispose();
      window.removeEventListener("resize", resizeHandler);
      observer.disconnect();
    };
  }, [socket]);

  return (
    <div
      ref={terminalRef}
      style={{ width: "100%", height: "100%", background: "#1e1e1e", padding: '5px' }}
    ></div>
  );
}

import { useEffect, useState } from "react";
import "../styles/Stats.css";
import type { VmStats } from "../utils/config";
import { SOCKET_BASE_URL } from "../utils/config";

interface StatsProps {
  nameVm: string;
  ipVm: string;
}

const Stats: React.FC<StatsProps> = ({ nameVm, ipVm }) => {
  const [statsVm, setStatsVm] = useState<VmStats>({
    cpuUsage: 0,
    memoryUsage: 0,
  });

  useEffect(() => {
  const ws = new WebSocket(`${SOCKET_BASE_URL}/stats?container=${nameVm}`);

  ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data); 

        setStatsVm({
          cpuUsage: Number(data.cpu.toFixed(2)),
          memoryUsage: Number(data.memory.toFixed(2)),
        });
      } catch (err) {
        console.error("Invalid WS message:", event.data);
      }
    };

  return () => ws.close();
}, [nameVm]);

 

  return (
    <div className="stats">
      <h2>
        {nameVm}
        <br />
        <small>{ipVm}</small>
      </h2>

      <h1>Cpu: {statsVm.cpuUsage}%</h1>
      <h1>Memory: {statsVm.memoryUsage}%</h1>
    </div>
  );
};

export default Stats;

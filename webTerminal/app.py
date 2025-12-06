#! /bin/python3

import os
import pty
import select
import subprocess
import time
from flask import Flask, request
from flask_sock import Sock

app = Flask(__name__)
sock = Sock(app)

@sock.route('/term')
def term(ws):
    container_id = request.args.get("container")
    if not container_id:
        ws.send("Error: container id required")
        return

    # Command for non-login interactive shell
    cmd = ["docker", "exec", "-it", container_id, "/bin/bash"]

    pid, fd = pty.fork()

    if pid == 0:
        # Child: replace with container shell
        os.execvp(cmd[0], cmd)

    else:
        # Parent: forward data between PTY and WebSocket
        while True:
            r, _, _ = select.select([fd], [], [], 0.1)

            if fd in r:
                try:
                    output = os.read(fd, 1024).decode()
                    ws.send(output)
                except:
                    break

            # data from websocket → PTY
            try:
                message = ws.receive(timeout=0.1)
                if message is not None:
                    os.write(fd, message.encode())
            except:
                pass

def parse_cpu_line(line):
    parts = line.split()
    return {
        "user": int(parts[1]),
        "nice": int(parts[2]),
        "system": int(parts[3]),
        "idle": int(parts[4]),
        "iowait": int(parts[5]),
        "irq": int(parts[6]),
        "softirq": int(parts[7]),
        "steal": int(parts[8]),
    }

def cpu_percentage(prev, curr):
    PrevIdle = prev["idle"] + prev["iowait"]
    Idle = curr["idle"] + curr["iowait"]

    PrevNonIdle = (
        prev["user"] + prev["nice"] + prev["system"] +
        prev["irq"] + prev["softirq"] + prev["steal"]
    )
    NonIdle = (
        curr["user"] + curr["nice"] + curr["system"] +
        curr["irq"] + curr["softirq"] + curr["steal"]
    )

    PrevTotal = PrevIdle + PrevNonIdle
    Total = Idle + NonIdle

    totald = Total - PrevTotal
    idled = Idle - PrevIdle

    if totald == 0:
        return 0.0

    return (totald - idled) / totald * 100.0


def parse_mem_line(line):
    parts = line.split()
    total = int(parts[1])
    used = int(parts[2])
    buffcache = int(parts[5])
    return total, used, buffcache

def mem_percentage(total, used, buffcache):
    real_used = used - buffcache
    return (real_used / total) * 100.0


@sock.route('/stats')
def stats(ws):
    container_id = request.args.get("container")
    if not container_id:
        ws.send("Error: container id required")
        return

    # initial CPU snapshot
    cpu1 = subprocess.check_output(
        f"docker exec {container_id} cat /proc/stat | head -n 1",
        shell=True
    ).decode()
    prev = parse_cpu_line(cpu1)

    while True:
        try:
            time.sleep(2)

            # CPU second snapshot
            cpu2 = subprocess.check_output(
                f"docker exec {container_id} cat /proc/stat | head -n 1",
                shell=True
            ).decode()
            curr = parse_cpu_line(cpu2)

            cpu_percent = cpu_percentage(prev, curr)
            prev = curr  # shift snapshot

            # MEMORY
            mem_line = subprocess.check_output(
                f"docker exec {container_id} free -m | grep Mem",
                shell=True
            ).decode()

            total, used, buffcache = parse_mem_line(mem_line)
            mem_percent = mem_percentage(total, used, buffcache)

            # send as JSON
            ws.send(f'{{"cpu": {cpu_percent:.2f}, "memory": {mem_percent:.2f}}}')

        except Exception as e:
            ws.send(f"Error: {str(e)}")
            break


if __name__ == "__main__":
    app.run("0.0.0.0",5000)

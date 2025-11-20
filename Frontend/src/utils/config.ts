export type DetailVm = {
    idVm: number,
    idSb: number,
    idNb: number,
    nameVm: string,
    ipVm: string,
    natIp: String
}

export type VmStats = {
  cpuUsage: number,
  memoryUsage: number
 }


export const API_BASE_URL = `${import.meta.env.VITE_API}/api`

export const SOCKET_BASE_URL = `${import.meta.env.VITE_SOCKET}`

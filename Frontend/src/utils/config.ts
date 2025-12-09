export type DetailVm = {
    idVm: number,
    idSb: number,
    nameVm: string,
    ipVm: string,
}

export type VmStats = {
  cpuUsage: number,
  memoryUsage: number
 }


export const API_BASE_URL = `${import.meta.env.VITE_API}/api`

export const SOCKET_BASE_URL = `${import.meta.env.VITE_SOCKET}`

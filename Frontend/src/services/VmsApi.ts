import { apiRequest } from '../utils/apiUtils';
import { API_BASE_URL } from '../utils/config';
import type { DetailVm } from '../utils/config';


// Vms API Service
const Vms_BASE_URL = `${API_BASE_URL}/vms`;


//get vms
export const getVms = () =>
    apiRequest<DetailVm[]>(Vms_BASE_URL,"/vms", {
        customErrors: {
            404: "no vm found",
        },
        successCode: 200
    });


//create vm
export const createVm = (data: { idSb: number , bridgeIp: string }) =>
    apiRequest<DetailVm>(Vms_BASE_URL,"/vm", {
        method: "POST",
        body: data,
        customErrors: {
            404: "Session bridge not found",
        },
        successCode: 201
    });


//delete Vm
export const deleteVm = (data: { idVm: number }) =>
    apiRequest<{ message: string, status: boolean }>(Vms_BASE_URL,`/vm/${data.idVm}`, {
        method: "DELETE",
        customErrors: {
            404: "Vm not found",
        },

        successCode: 200
    });


export const pruneVm = () =>
    apiRequest<{ message: string, status: boolean }>(Vms_BASE_URL,`/vm`, {
        method: "DELETE",
        customErrors: {
            404: "Session bridge not found",
        },
        successCode: 200
    });











export default {
  getVms,
  createVm

}
    

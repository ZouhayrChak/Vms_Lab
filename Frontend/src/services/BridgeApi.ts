import { apiRequest } from '../utils/apiUtils';
import { API_BASE_URL } from '../utils/config';


// Bridges API Service
const AUTH_BASE_URL = `${API_BASE_URL}/bridges`;


//create session bridge
export const createSessionBridge = () =>
    apiRequest<{ idSb: number, bridgeIp: String }>(AUTH_BASE_URL, '/sb', {
        method: 'POST',
        customErrors: {
            409:"user already has session bridge"
        },
        successCode: 201
    });


export default {
  createSessionBridge
  
}
    
import { apiRequest } from '../utils/apiUtils';
import { API_BASE_URL } from '../utils/config';

// Authentication API Service
const AUTH_BASE_URL = `${API_BASE_URL}/auth`;

export const loginReq = (data : { email: string, password: string }) =>
    apiRequest<{ token: string, role: string }>(AUTH_BASE_URL, '/login', {
        method: 'POST',
        body: data,
        customErrors: {
            401: 'Email ou mot de passe incorrect',
        },
        successCode: 200
    });

export default {
  loginReq
}
    
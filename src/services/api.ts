// ============================================
// Cliente HTTP Axios para API
// ============================================

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

export const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para logs em desenvolvimento
if (process.env.NODE_ENV === 'development') {
    api.interceptors.response.use(
        (response) => {
            console.debug(`[API] ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
            return response;
        },
        (error) => {
            console.error(`[API] Error:`, error.response?.data || error.message);
            return Promise.reject(error);
        }
    );
}

export default api;

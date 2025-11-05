import axios from 'axios';
import type { AxiosInstance } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para agregar token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authApi = {
    register: (email: string, name: string, password: string) =>
        api.post('/auth/register', { email, name, password }),
    login: (email: string, password: string) =>
        api.post('/auth/login', { email, password }),
};

export const cashApi = {
    openCash: (openingBalance: number) =>
        api.post('/cash-register/open', { openingBalance }),
    getStatus: () =>
        api.get('/cash-register/status'),
    createMovement: (cashId: string, type: 'SALE' | 'EXPENSE', amount: number, paymentMethod: string, description?: string, category?: string) =>
        api.post('/cash-register/movement', { cashId, type, amount, paymentMethod, description, category }),
    closeCash: (cashId: string, actualBalance: number, notes?: string) =>
        api.post(`/cash-register/close/${cashId}`, { actualBalance, notes }),
    getHistory: () =>
        api.get('/cash-register/history'),
    getMovements: (cashId: string) =>
        api.get(`/cash-register/movements/${cashId}`),
};

export default api;
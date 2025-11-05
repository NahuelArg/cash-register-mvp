import { create } from 'zustand';
import { authApi } from '../services/api';

interface User {
    id: string;
    email: string;
    name: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, name: string, password: string) => Promise<void>;
    logout: () => void;
    initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isLoading: false,
    error: null,

    initialize: () => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        if (token && userStr) {
            try {
                set({ token, user: JSON.parse(userStr) });
            } catch (e) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
    },

    login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await authApi.login(email, password);
            localStorage.setItem('token', data.accessToken);
            localStorage.setItem('user', JSON.stringify(data.user));
            set({ token: data.accessToken, user: data.user, isLoading: false });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al iniciar sesión';
            set({ error: errorMessage, isLoading: false });
            throw error;
        }
    },

    register: async (email: string, name: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await authApi.register(email, name, password);
            localStorage.setItem('token', data.accessToken);
            localStorage.setItem('user', JSON.stringify(data.user));
            set({ token: data.accessToken, user: data.user, isLoading: false });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al registrarse';
            set({ error: errorMessage, isLoading: false });
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ token: null, user: null });
    },
}));
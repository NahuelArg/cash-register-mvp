import { create } from 'zustand';
import { cashApi } from '../services/api';

interface Movement {
  id: string;
  type: string;
  amount: number;
  paymentMethod: string;
  description?: string;
  category?: string;
  createdAt: string;
}

interface CashStatus {
  id: string;
  balance: number;
  isOpen: boolean;
  openedAt: string;
  movements: Movement[];
  summary: {
    totalIncomes: number;
    totalExpenses: number;
    currentBalance: number;
  };
}

interface CashState {
  cash: CashStatus | null;
  isLoading: boolean;
  error: string | null;

  openCash: (openingBalance: number) => Promise<void>;
  getStatus: () => Promise<void>;
  createMovement: (
    cashId: string,
    type: 'SALE' | 'EXPENSE',
    amount: number,
    paymentMethod: string,
    description?: string,
    category?: string
  ) => Promise<void>;
  closeCash: (cashId: string, actualBalance: number, notes?: string) => Promise<any>;
  getHistory: () => Promise<any>;
  reset: () => void;
}

export const useCashStore = create<CashState>((set, get) => ({
  cash: null,
  isLoading: false,
  error: null,

  openCash: async (openingBalance: number) => {
    set({ isLoading: true, error: null });
    try {
      await cashApi.openCash(openingBalance);
      await get().getStatus();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al abrir caja';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  getStatus: async () => {
    set({ isLoading: true });
    try {
      const { data } = await cashApi.getStatus();
      set({ cash: data, error: null });
    } catch (error: any) {
      set({ cash: null });
    } finally {
      set({ isLoading: false });
    }
  },

  createMovement: async (cashId: string, type: 'SALE' | 'EXPENSE', amount: number, paymentMethod: string, description?: string, category?: string) => {
    set({ isLoading: true, error: null });
    try {
      await cashApi.createMovement(cashId, type, amount, paymentMethod, description, category);
      await get().getStatus();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al registrar movimiento';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  closeCash: async (cashId: string, actualBalance: number, notes?: string) => {
    set({ isLoading: true, error: null });
    try {
      const result = await cashApi.closeCash(cashId, actualBalance, notes);
      await get().getStatus();
      return result.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al cerrar caja';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  getHistory: async () => {
    try {
      const { data } = await cashApi.getHistory();
      return data;
    } catch (error) {
      set({ error: 'Error al obtener historial' });
      throw error;
    }
  },

  reset: () => {
    set({ cash: null, error: null });
  },
}));
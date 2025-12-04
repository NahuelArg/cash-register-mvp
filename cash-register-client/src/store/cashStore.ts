import { create } from 'zustand';
import { cashApi, type HistoryFilters } from '../services/api';

interface Movement {
  id: string;
  type: string;
  amount: number;
  paymentMethod: string;
  description?: string;
  category?: string;
  barberId?: string;
  barber?: {
    id: string;
    name: string;
  };
  createdAt: string;
}

interface PaymentBreakdown {
  cash: number;
  card: number;
  transfer: number;
  mixed: number;
}

interface BarberBreakdownItem {
  barberId: string;
  barberName: string;
  totalSales: number;
  salesCount: number;
  paymentBreakdown?: PaymentBreakdown;
}

interface CashClosing {
  id: string;
  expectedBalance: number;
  actualBalance: number;
  difference: number;
  notes?: string;
  closedAt: string;
  paymentBreakdown?: PaymentBreakdown;
  barberBreakdown?: BarberBreakdownItem[];
  salesCount?: number;
  expensesCount?: number;
  totalSales?: number;
  totalExpenses?: number;
  closedBy?: {
    id: string;
    name: string;
    email: string;
  };
  cashRegister?: {
    id: string;
    openedAt: string;
    closedAt?: string;
  };
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
    category?: string,
    barberId?: string
  ) => Promise<void>;
  closeCash: (cashId: string, actualBalance: number, notes?: string) => Promise<CashClosing>;
  getHistory: (filters?: HistoryFilters) => Promise<CashClosing[]>;
  reset: () => void;
}

export type { CashClosing, PaymentBreakdown, Movement, BarberBreakdownItem };

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

  createMovement: async (cashId: string, type: 'SALE' | 'EXPENSE', amount: number, paymentMethod: string, description?: string, category?: string, barberId?: string) => {
    set({ isLoading: true, error: null });
    try {
      await cashApi.createMovement(cashId, type, amount, paymentMethod, description, category, barberId);
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

  getHistory: async (filters?: HistoryFilters) => {
    try {
      const { data } = await cashApi.getHistory(filters);
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

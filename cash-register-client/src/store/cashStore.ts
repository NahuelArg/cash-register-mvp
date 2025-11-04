import { create } from 'zustand';

interface CashState {
    cashId: string | null;
    balance: number;
    isOpen: boolean;
    movements: any[];

    // Actions
    openCash: (amount: number) => Promise<void>;
    addMovement: (type: 'INCOME' | 'EXPENSE', amount: number, description: string) => Promise<void>;
    closeCash: (actualBalance: number) => Promise<void>;
    fetchStatus: () => Promise<void>;
}

export const useCashStore = create<CashState>((set) => ({
    cashId: null,
    balance: 0,
    isOpen: false,
    movements: [],

    openCash: async (amount) => {
        // API call
        set({ isOpen: true, balance: amount });
    },

    addMovement: async (type, amount, description) => {
        // API call - update movements
    },

    closeCash: async (actualBalance) => {
        // API call
        set({ isOpen: false });
    },

    fetchStatus: async () => {
        // API call to get current status
    }
}));
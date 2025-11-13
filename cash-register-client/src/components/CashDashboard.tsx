import  { useEffect } from 'react';
import { useCashStore } from '../store/cashStore';
import { OpenCashForm } from './OpenCashForm';
import { TransactionForm } from './TransactionForm';
import { HistoryList } from './HistoryList';
import { ClosingForm } from './ClosingForm';

export const CashDashboard = () => {
    const { isOpen, balance, movements, fetchStatus } = useCashStore((state) => ({
        isOpen: state.cash?.isOpen ?? false,
        balance: state.cash?.balance ?? 0,
        movements: state.cash?.movements ?? [],
        fetchStatus: state.getStatus,
    }));
    useEffect(() => {
        fetchStatus();
    }, []);

    if (!isOpen) {
        return <OpenCashForm />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
            {/* BALANCE GRANDE */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
                <div className="text-center">
                    <p className="text-gray-500 text-lg mb-2">BALANCE ACTUAL</p>
                    <h1 className="text-6xl font-bold text-green-600">
                        ${balance.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </h1>
                    <p className="text-sm text-gray-400 mt-2">Última actualización: {new Date().toLocaleTimeString()}</p>
                </div>
            </div>

            {/* BOTONES DE ACCIÓN */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <TransactionForm type="INCOME" />
                <TransactionForm type="EXPENSE" />
            </div>

            {/* HISTORIAL */}
            <HistoryList movements={movements} />

            {/* BOTÓN CERRAR */}
            <ClosingForm cashId="1" currentBalance={balance} />
        </div>
    );
};
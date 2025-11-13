import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCashStore } from '../store/cashStore';
import { TransactionForm } from '../components/TransactionForm';
import { HistoryList } from '../components/HistoryList';
import { OpenCashForm } from '../components/OpenCashForm';
import { ClosingForm } from '../components/ClosingForm';

export const CashRegister: React.FC = () => {
    const { logout, user } = useAuthStore();
    const { cash, getStatus, error } = useCashStore();
    const navigate = useNavigate();

    useEffect(() => {
        getStatus();
        const interval = setInterval(getStatus, 5000);
        return () => clearInterval(interval);
    }, [getStatus]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!cash) {
        return <OpenCashForm />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-white">💰 Caja - {user?.name}</h1>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate('/history')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                    >
                        📊 Historial de Cierres
                    </button>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </div>

            {/* Big Balance */}
            <div className="bg-white rounded-lg shadow-xl p-8 mb-6">
                <div className="text-center">
                    <p className="text-gray-600 text-lg mb-2 font-medium">BALANCE ACTUAL</p>
                    <h2 className="text-6xl font-bold text-green-600">
                        €{cash.balance.toLocaleString('es-ES', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </h2>
                    <p className="text-sm text-gray-500 mt-2">
                        Desde las {new Date(cash.openedAt).toLocaleTimeString('es-ES')}
                    </p>
                </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                    <p className="text-gray-600 text-sm font-medium">INGRESOS</p>
                    <p className="text-2xl font-bold text-green-600">
                        +€{cash.summary.totalIncomes.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </p>
                </div>
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                    <p className="text-gray-600 text-sm font-medium">EGRESOS</p>
                    <p className="text-2xl font-bold text-red-600">
                        -€{cash.summary.totalExpenses.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </p>
                </div>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <p className="text-gray-600 text-sm font-medium">MOVIMIENTOS</p>
                    <p className="text-2xl font-bold text-blue-600">
                        {cash.movements.length}
                    </p>
                </div>
            </div>

            {/* Error display */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Transactions Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            Registrar Movimiento
                        </h3>
                        <TransactionForm type='INCOME' />
                    </div>
                </div>

                {/* History */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            Movimientos de Hoy
                        </h3>
                        <HistoryList movements={cash.movements} />
                    </div>
                </div>
            </div>

            {/* Close Button */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <ClosingForm cashId={cash.id} currentBalance={cash.balance} />
            </div>
        </div>
    );
};
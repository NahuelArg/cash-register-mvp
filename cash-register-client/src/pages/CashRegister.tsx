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
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-50 to-primary-100 p-4 md:p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                        💰 Caja Registradora
                    </h1>
                    <p className="text-gray-600 mt-1 font-medium">Bienvenido, {user?.name}</p>
                </div>
                <div className="flex gap-3 flex-wrap">
                    <button
                        onClick={() => navigate('/history')}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                    >
                        📊 Historial
                    </button>
                    <button
                        onClick={handleLogout}
                        className="bg-danger-500 hover:bg-danger-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </div>

            {/* Big Balance */}
            <div className="bg-white rounded-2xl shadow-soft p-8 md:p-10 mb-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="text-center">
                    <p className="text-gray-500 text-sm uppercase tracking-wider mb-3 font-semibold">Balance Actual</p>
                    <h2 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-success-500 to-success-600 bg-clip-text text-transparent mb-3 transition-all duration-300">
                        €{cash.balance.toLocaleString('es-ES', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </h2>
                    <div className="inline-flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full">
                        <span className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></span>
                        <p className="text-sm text-gray-600 font-medium">
                            Abierto desde {new Date(cash.openedAt).toLocaleTimeString('es-ES')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
                <div className="bg-gradient-to-br from-success-50 to-success-100 border border-success-200 p-6 rounded-2xl shadow-card hover:shadow-lg transition-all duration-200 transform hover:scale-105">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-success-700 text-sm font-semibold uppercase tracking-wide">Ingresos</p>
                        <span className="text-2xl">💰</span>
                    </div>
                    <p className="text-3xl font-bold text-success-600">
                        +€{cash.summary.totalIncomes.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </p>
                </div>
                <div className="bg-gradient-to-br from-danger-50 to-danger-100 border border-danger-200 p-6 rounded-2xl shadow-card hover:shadow-lg transition-all duration-200 transform hover:scale-105">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-danger-700 text-sm font-semibold uppercase tracking-wide">Egresos</p>
                        <span className="text-2xl">💸</span>
                    </div>
                    <p className="text-3xl font-bold text-danger-600">
                        -€{cash.summary.totalExpenses.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </p>
                </div>
                <div className="bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 p-6 rounded-2xl shadow-card hover:shadow-lg transition-all duration-200 transform hover:scale-105">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-primary-700 text-sm font-semibold uppercase tracking-wide">Movimientos</p>
                        <span className="text-2xl">📝</span>
                    </div>
                    <p className="text-3xl font-bold text-primary-600">
                        {cash.movements.length}
                    </p>
                </div>
            </div>

            {/* Error display */}
            {error && (
                <div className="bg-danger-50 border-l-4 border-danger-500 text-danger-700 px-6 py-4 rounded-xl mb-6 shadow-card">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">⚠️</span>
                        <p className="font-medium">{error}</p>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Transactions Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-card p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-200">
                        <div className="flex items-center gap-2 mb-5">
                            <span className="text-2xl">➕</span>
                            <h3 className="text-xl font-bold text-gray-800">
                                Registrar Movimiento
                            </h3>
                        </div>
                        <TransactionForm type='INCOME' />
                    </div>
                </div>

                {/* History */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-card p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-200">
                        <div className="flex items-center gap-2 mb-5">
                            <span className="text-2xl">📋</span>
                            <h3 className="text-xl font-bold text-gray-800">
                                Movimientos de Hoy
                            </h3>
                        </div>
                        <HistoryList movements={cash.movements} />
                    </div>
                </div>
            </div>

            {/* Close Button */}
            <div className="bg-white rounded-2xl shadow-card p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-200">
                <ClosingForm cashId={cash.id} currentBalance={cash.balance} />
            </div>
        </div>
    );
};
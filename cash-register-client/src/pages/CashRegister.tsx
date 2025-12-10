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
        <div className="min-h-screen bg-neutral-50 p-4 md:p-6 lg:p-8">
            {/* Header */}
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white rounded-lg shadow-subtle p-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-neutral-900">
                            Sistema de Caja Registradora
                        </h1>
                        <p className="text-neutral-600 mt-2 text-sm">
                            <span className="font-medium">{user?.name}</span> • {new Date().toLocaleDateString('es-ES', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                        <button
                            onClick={() => navigate('/history')}
                            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-subtle transition-colors duration-150"
                        >
                            Historial de Cierres
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-300 px-6 py-2.5 rounded-lg font-medium shadow-subtle transition-colors duration-150"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>

                {/* Big Balance */}
                <div className="bg-white rounded-lg shadow-card p-8 md:p-10 mb-6 border border-neutral-200">
                    <div className="text-center">
                        <p className="text-neutral-500 text-xs uppercase tracking-wider mb-4 font-semibold">Balance Actual de Caja</p>
                        <h2 className="text-5xl md:text-6xl font-bold text-neutral-900 mb-4">
                            €{cash.balance.toLocaleString('es-ES', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </h2>
                        <div className="inline-flex items-center gap-3 bg-neutral-50 px-5 py-2.5 rounded-lg border border-neutral-200">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-success-500 rounded-full"></span>
                                <span className="text-sm text-neutral-600 font-medium">Caja Abierta</span>
                            </div>
                            <span className="text-neutral-300">|</span>
                            <p className="text-sm text-neutral-600 font-medium">
                                Desde {new Date(cash.openedAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white border border-neutral-200 p-6 rounded-lg shadow-card">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-neutral-600 text-xs font-semibold uppercase tracking-wider">Ingresos Totales</p>
                            <div className="w-10 h-10 rounded-lg bg-success-50 flex items-center justify-center">
                                <svg className="w-5 h-5 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-neutral-900 mb-1">
                            €{cash.summary.totalIncomes.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-success-600 font-medium">Ingresado hoy</p>
                    </div>
                    <div className="bg-white border border-neutral-200 p-6 rounded-lg shadow-card">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-neutral-600 text-xs font-semibold uppercase tracking-wider">Egresos Totales</p>
                            <div className="w-10 h-10 rounded-lg bg-danger-50 flex items-center justify-center">
                                <svg className="w-5 h-5 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-neutral-900 mb-1">
                            €{cash.summary.totalExpenses.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-danger-600 font-medium">Gastado hoy</p>
                    </div>
                    <div className="bg-white border border-neutral-200 p-6 rounded-lg shadow-card">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-neutral-600 text-xs font-semibold uppercase tracking-wider">Total Movimientos</p>
                            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-neutral-900 mb-1">
                            {cash.movements.length}
                        </p>
                        <p className="text-xs text-primary-600 font-medium">Transacciones registradas</p>
                    </div>
                </div>

                {/* Error display */}
                {error && (
                    <div className="bg-danger-50 border-l-4 border-danger-500 text-danger-700 px-6 py-4 rounded-lg mb-6 shadow-subtle">
                        <div className="flex items-center gap-3">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <p className="font-medium">{error}</p>
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Transactions Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-card p-6 border border-neutral-200">
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-neutral-900">
                                    Registrar Movimiento
                                </h3>
                                <p className="text-sm text-neutral-500 mt-1">Complete el formulario para registrar una transacción</p>
                            </div>
                            <TransactionForm type='INCOME' />
                        </div>
                    </div>

                    {/* History */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-card p-6 border border-neutral-200">
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-neutral-900">
                                    Movimientos del Día
                                </h3>
                                <p className="text-sm text-neutral-500 mt-1">Historial de transacciones de la sesión actual</p>
                            </div>
                            <HistoryList movements={cash.movements} />
                        </div>
                    </div>
                </div>

                {/* Close Button */}
                <div className="bg-white rounded-lg shadow-card p-6 border border-neutral-200">
                    <ClosingForm cashId={cash.id} currentBalance={cash.balance} />
                </div>
            </div>
        </div>
    );
};
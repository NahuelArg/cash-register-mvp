import React, { useState, useEffect } from 'react';
import { useCashStore, type CashClosing } from '../store/cashStore';

export const ClosingHistory: React.FC = () => {
    const [closings, setClosings] = useState<CashClosing[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'month' | 'year' | 'custom'>('month');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedClosing, setSelectedClosing] = useState<CashClosing | null>(null);
    const { getHistory } = useCashStore();

    const loadHistory = async () => {
        setIsLoading(true);
        try {
            let filters: any = {};

            if (selectedPeriod === 'custom') {
                if (startDate) filters.startDate = startDate;
                if (endDate) filters.endDate = endDate;
            } else {
                filters.period = selectedPeriod;
            }

            const data = await getHistory(filters);
            setClosings(data);
        } catch (error) {
            console.error('Error loading history:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadHistory();
    }, [selectedPeriod, startDate, endDate]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatCurrency = (amount: number) => {
        return `€${amount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Historial de Cierres</h2>

                {/* Filters */}
                <div className="space-y-4">
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={() => setSelectedPeriod('day')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${
                                selectedPeriod === 'day'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Hoy
                        </button>
                        <button
                            onClick={() => setSelectedPeriod('month')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${
                                selectedPeriod === 'month'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Este Mes
                        </button>
                        <button
                            onClick={() => setSelectedPeriod('year')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${
                                selectedPeriod === 'year'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Este Año
                        </button>
                        <button
                            onClick={() => setSelectedPeriod('custom')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${
                                selectedPeriod === 'custom'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Personalizado
                        </button>
                    </div>

                    {/* Custom Date Range */}
                    {selectedPeriod === 'custom' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Fecha Inicio
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Fecha Fin
                                </label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-2 text-gray-600">Cargando historial...</p>
                </div>
            )}

            {/* Closings List */}
            {!isLoading && closings.length === 0 && (
                <div className="bg-white p-8 rounded-lg shadow text-center">
                    <p className="text-gray-500">No hay cierres en el período seleccionado</p>
                </div>
            )}

            {!isLoading && closings.length > 0 && (
                <div className="grid gap-4">
                    {closings.map((closing) => (
                        <div
                            key={closing.id}
                            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition cursor-pointer"
                            onClick={() => setSelectedClosing(closing)}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <p className="text-sm text-gray-500">Fecha de Cierre</p>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {formatDate(closing.closedAt)}
                                    </p>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    closing.difference >= 0
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {closing.difference >= 0 ? '+' : ''}{formatCurrency(closing.difference)}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div>
                                    <p className="text-xs text-gray-500">Esperado</p>
                                    <p className="text-sm font-semibold text-blue-600">
                                        {formatCurrency(closing.expectedBalance)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Real</p>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {formatCurrency(closing.actualBalance)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Ventas</p>
                                    <p className="text-sm font-semibold text-green-600">
                                        {closing.salesCount || 0} ({formatCurrency(closing.totalSales || 0)})
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Egresos</p>
                                    <p className="text-sm font-semibold text-red-600">
                                        {closing.expensesCount || 0} ({formatCurrency(closing.totalExpenses || 0)})
                                    </p>
                                </div>
                            </div>

                            {closing.notes && (
                                <div className="mt-3 p-2 bg-gray-50 rounded">
                                    <p className="text-xs text-gray-500">Notas:</p>
                                    <p className="text-sm text-gray-700">{closing.notes}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Detail Modal */}
            {selectedClosing && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                    onClick={() => setSelectedClosing(null)}
                >
                    <div
                        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 space-y-4">
                            <div className="flex justify-between items-start">
                                <h3 className="text-2xl font-bold text-gray-900">Detalle del Cierre</h3>
                                <button
                                    onClick={() => setSelectedClosing(null)}
                                    className="text-gray-500 hover:text-gray-700 text-2xl"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="grid gap-4">
                                {/* Date and User */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600">Fecha de Cierre</p>
                                    <p className="text-xl font-semibold text-gray-900">
                                        {formatDate(selectedClosing.closedAt)}
                                    </p>
                                    {selectedClosing.closedBy && (
                                        <p className="text-sm text-gray-600 mt-2">
                                            Cerrado por: {selectedClosing.closedBy.name}
                                        </p>
                                    )}
                                </div>

                                {/* Balances */}
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                        <p className="text-xs text-gray-600">Esperado</p>
                                        <p className="text-xl font-bold text-blue-600">
                                            {formatCurrency(selectedClosing.expectedBalance)}
                                        </p>
                                    </div>
                                    <div className="bg-green-50 p-3 rounded-lg">
                                        <p className="text-xs text-gray-600">Real</p>
                                        <p className="text-xl font-bold text-green-600">
                                            {formatCurrency(selectedClosing.actualBalance)}
                                        </p>
                                    </div>
                                    <div className={`p-3 rounded-lg ${
                                        selectedClosing.difference >= 0 ? 'bg-green-100' : 'bg-red-100'
                                    }`}>
                                        <p className="text-xs text-gray-600">Diferencia</p>
                                        <p className={`text-xl font-bold ${
                                            selectedClosing.difference >= 0 ? 'text-green-700' : 'text-red-700'
                                        }`}>
                                            {selectedClosing.difference >= 0 ? '+' : ''}
                                            {formatCurrency(selectedClosing.difference)}
                                        </p>
                                    </div>
                                </div>

                                {/* Payment Method Breakdown */}
                                {selectedClosing.paymentBreakdown && (
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-900 mb-3">
                                            Desglose por Método de Pago
                                        </h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-green-50 p-3 rounded-lg">
                                                <p className="text-sm text-gray-600">💵 Efectivo</p>
                                                <p className="text-lg font-bold text-green-700">
                                                    {formatCurrency(selectedClosing.paymentBreakdown.cash)}
                                                </p>
                                            </div>
                                            <div className="bg-blue-50 p-3 rounded-lg">
                                                <p className="text-sm text-gray-600">💳 Tarjeta</p>
                                                <p className="text-lg font-bold text-blue-700">
                                                    {formatCurrency(selectedClosing.paymentBreakdown.card)}
                                                </p>
                                            </div>
                                            <div className="bg-purple-50 p-3 rounded-lg">
                                                <p className="text-sm text-gray-600">🏦 Transferencia</p>
                                                <p className="text-lg font-bold text-purple-700">
                                                    {formatCurrency(selectedClosing.paymentBreakdown.transfer)}
                                                </p>
                                            </div>
                                            <div className="bg-orange-50 p-3 rounded-lg">
                                                <p className="text-sm text-gray-600">🔀 Mixto</p>
                                                <p className="text-lg font-bold text-orange-700">
                                                    {formatCurrency(selectedClosing.paymentBreakdown.mixed)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Statistics */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-green-50 p-3 rounded-lg">
                                        <p className="text-sm text-gray-600">Total Ventas</p>
                                        <p className="text-lg font-bold text-green-700">
                                            {selectedClosing.salesCount || 0} operaciones
                                        </p>
                                        <p className="text-xl font-bold text-green-700">
                                            {formatCurrency(selectedClosing.totalSales || 0)}
                                        </p>
                                    </div>
                                    <div className="bg-red-50 p-3 rounded-lg">
                                        <p className="text-sm text-gray-600">Total Egresos</p>
                                        <p className="text-lg font-bold text-red-700">
                                            {selectedClosing.expensesCount || 0} operaciones
                                        </p>
                                        <p className="text-xl font-bold text-red-700">
                                            {formatCurrency(selectedClosing.totalExpenses || 0)}
                                        </p>
                                    </div>
                                </div>

                                {/* Notes */}
                                {selectedClosing.notes && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm font-semibold text-gray-700 mb-2">Notas</p>
                                        <p className="text-gray-900">{selectedClosing.notes}</p>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => setSelectedClosing(null)}
                                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

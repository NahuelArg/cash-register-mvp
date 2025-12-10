import React, { useState } from 'react';
import { useCashStore } from '../store/cashStore';
import { BarberSelector } from './BarberSelector';

interface TransactionFormProps {
    type: "INCOME" | "EXPENSE";
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ type }) => {
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('CASH');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [barberId, setBarberId] = useState('');
    const { cash, createMovement, isLoading, error } = useCashStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!cash?.id) return;

        try {
            await createMovement(
                cash.id,
                transactionType === 'INCOME' ? 'SALE' : 'EXPENSE',
                parseFloat(amount),
                paymentMethod,
                description,
                category,
                barberId || undefined
            );
            setAmount('');
            setDescription('');
            setCategory('');
            setBarberId('');
        } catch {
            // Error handled by store
        }
    };

    const [transactionType, setTransactionType] = useState<"INCOME" | "EXPENSE">(type);

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Type Selection */}
            <div className="grid grid-cols-2 gap-3">
                <button
                    type="button"
                    onClick={() => setTransactionType('INCOME')}
                    className={`py-3 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${transactionType === 'INCOME'
                            ? 'bg-gradient-to-r from-success-500 to-success-600 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    💰 Ingreso
                </button>
                <button
                    type="button"
                    onClick={() => setTransactionType('EXPENSE')}
                    className={`py-3 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${transactionType === 'EXPENSE'
                            ? 'bg-gradient-to-r from-danger-500 to-danger-600 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    💸 Egreso
                </button>
            </div>

            {/* Amount */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Monto (€)
                </label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">€</span>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                        placeholder="0.00"
                        required
                    />
                </div>
            </div>

            {/* Payment Method */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Método de Pago
                </label>
                <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white"
                >
                    <option value="CASH">💵 Efectivo</option>
                    <option value="CARD">💳 Tarjeta</option>
                    <option value="TRANSFER">🏦 Transferencia</option>
                    <option value="MIXED">🔀 Mixto</option>
                </select>
            </div>

            {/* Barber Selector - Only for INCOME */}
            {transactionType === 'INCOME' && (
                <BarberSelector
                    value={barberId}
                    onChange={setBarberId}
                    required={true}
                />
            )}

            {/* Description */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Descripción (Opcional)
                </label>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    placeholder="Ej: Corte de cabello"
                />
            </div>

            {/* Category */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Categoría (Opcional)
                </label>
                <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    placeholder="Ej: Servicios"
                />
            </div>

            {error && (
                <div className="p-4 bg-danger-50 border-l-4 border-danger-500 text-danger-700 text-sm rounded-xl flex items-center gap-2">
                    <span>⚠️</span>
                    <span className="font-medium">{error}</span>
                </div>
            )}

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin">⏳</span>
                        Guardando...
                    </span>
                ) : (
                    <span className="flex items-center justify-center gap-2">
                        <span>✓</span>
                        Guardar Movimiento
                    </span>
                )}
            </button>
        </form>
    );
};
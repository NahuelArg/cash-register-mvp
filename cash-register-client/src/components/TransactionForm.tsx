import React, { useState } from 'react';
import { useCashStore } from '../store/cashStore';

interface TransactionFormProps {
    type: "INCOME" | "EXPENSE";
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ type }) => {
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('CASH');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const { cash, createMovement, isLoading, error } = useCashStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!cash?.id) return;

        try {
            await createMovement(
                cash.id,
                type === 'INCOME' ? 'SALE' : 'EXPENSE',
                parseFloat(amount),
                paymentMethod,
                description,
                category
            );
            setAmount('');
            setDescription('');
            setCategory('');
        } catch {
            // Error handled by store
        }
    };

    const [transactionType, setTransactionType] = useState<"INCOME" | "EXPENSE">(type);

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Type Selection */}
            <div className="grid grid-cols-2 gap-2">
                <button
                    type="button"
                    onClick={() => setTransactionType('INCOME')}
                    className={`py-2 px-3 rounded-lg font-medium transition ${transactionType === 'INCOME'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-200 text-gray-800'
                        }`}
                >
                    + Ingreso
                </button>
                <button
                    type="button"
                    onClick={() => setTransactionType('EXPENSE')}
                    className={`py-2 px-3 rounded-lg font-medium transition ${type === 'EXPENSE'
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-200 text-gray-800'
                        }`}
                >
                    - Egreso
                </button>
            </div>

            {/* Amount */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monto (€)
                </label>
                <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                    required
                />
            </div>

            {/* Payment Method */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Método de Pago
                </label>
                <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="CASH">Efectivo</option>
                    <option value="CARD">Tarjeta</option>
                    <option value="TRANSFER">Transferencia</option>
                    <option value="MIXED">Mixto</option>
                </select>
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                </label>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Corte"
                />
            </div>

            {/* Category */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoría
                </label>
                <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Servicios"
                />
            </div>

            {error && (
                <div className="p-2 bg-red-100 border border-red-400 text-red-700 text-sm rounded">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
                {isLoading ? 'Guardando...' : 'Guardar Movimiento'}
            </button>
        </form>
    );
};
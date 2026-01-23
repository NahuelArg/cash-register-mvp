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
                type === 'INCOME' ? 'SALE' : 'EXPENSE',
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
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Type Selection */}
            <div className="grid grid-cols-2 gap-2">
                <button
                    type="button"
                    onClick={() => setTransactionType('INCOME')}
                    className={`py-2.5 px-4 rounded-lg font-medium transition-colors duration-150 ${transactionType === 'INCOME'
                            ? 'bg-success-600 text-white'
                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        }`}
                >
                    Ingreso
                </button>
                <button
                    type="button"
                    onClick={() => setTransactionType('EXPENSE')}
                    className={`py-2.5 px-4 rounded-lg font-medium transition-colors duration-150 ${transactionType === 'EXPENSE'
                            ? 'bg-danger-600 text-white'
                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        }`}
                >
                    Egreso
                </button>
            </div>

            {/* Amount */}
            <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Monto <span className="text-danger-500">*</span>
                </label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 font-medium">€</span>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full pl-8 pr-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-150"
                        placeholder="0.00"
                        required
                    />
                </div>
            </div>

            {/* Payment Method */}
            <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Método de Pago <span className="text-danger-500">*</span>
                </label>
                <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-150 bg-white"
                >
                    <option value="CASH">Efectivo</option>
                    <option value="CARD">Tarjeta</option>
                    <option value="TRANSFER">Transferencia</option>
                    <option value="MIXED">Mixto</option>
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
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Descripción
                </label>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-150"
                    placeholder="Descripción del movimiento"
                />
            </div>

            {/* Category */}
            <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Categoría
                </label>
                <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-150"
                    placeholder="Categoría contable"
                />
            </div>

            {error && (
                <div className="p-3 bg-danger-50 border border-danger-200 text-danger-700 text-sm rounded-lg flex items-center gap-2">
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">{error}</span>
                </div>
            )}

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-400 text-white font-semibold py-3 px-4 rounded-lg shadow-subtle transition-colors duration-150 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Procesando...' : 'Guardar Movimiento'}
            </button>
        </form>
    );
};
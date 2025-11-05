import React, { useState } from 'react';
import { useCashStore } from '../store/cashStore';

export const OpenCashForm: React.FC = () => {
    const [amount, setAmount] = useState('');
    const { openCash, isLoading, error } = useCashStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await openCash(parseFloat(amount));
        } catch {
            // Error handled by store
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                    💰 Abrir Caja
                </h1>
                <p className="text-gray-600 text-center mb-8">
                    Ingresa el monto inicial de la caja
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Monto Inicial (€)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="100.00"
                            required
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition text-lg"
                    >
                        {isLoading ? 'Abriendo...' : 'Abrir Caja'}
                    </button>
                </form>
            </div>
        </div>
    );
};
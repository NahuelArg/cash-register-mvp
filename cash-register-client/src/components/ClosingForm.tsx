import React, { useState } from 'react';
import { useCashStore } from '../store/cashStore';

interface ClosingFormProps {
    cashId: string;
    currentBalance: number;
}

export const ClosingForm: React.FC<ClosingFormProps> = ({
    cashId,
    currentBalance,
}) => {
    const [actualBalance, setActualBalance] = useState(currentBalance.toString());
    const [notes, setNotes] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const { closeCash, isLoading, error } = useCashStore();

    const difference = parseFloat(actualBalance) - currentBalance;

    const handleClose = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await closeCash(cashId, parseFloat(actualBalance), notes);
            setIsOpen(false);
            setActualBalance(currentBalance.toString());
            setNotes('');
        } catch {
            // Error handled by store
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition text-lg"
            >
                🔒 Cerrar Caja
            </button>
        );
    }

    return (
        <form onSubmit={handleClose} className="space-y-4 p-6 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-xl font-bold text-gray-900">Cierre de Caja</h3>

            {/* Expected Balance */}
            <div className="bg-white p-3 rounded border border-gray-200">
                <p className="text-sm text-gray-600">Sistema espera:</p>
                <p className="text-2xl font-bold text-blue-600">
                    €{currentBalance.toLocaleString('es-ES', {
                        minimumFractionDigits: 2,
                    })}
                </p>
            </div>

            {/* Actual Balance */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monto contado en caja (€)
                </label>
                <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={actualBalance}
                    onChange={(e) => setActualBalance(e.target.value)}
                    className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                />
            </div>

            {/* Difference */}
            <div
                className={`p-3 rounded-lg text-center ${difference >= 0
                        ? 'bg-green-100 border border-green-300'
                        : 'bg-orange-100 border border-orange-300'
                    }`}
            >
                <p className="text-sm text-gray-600">Diferencia</p>
                <p
                    className={`text-2xl font-bold ${difference >= 0 ? 'text-green-600' : 'text-orange-600'
                        }`}
                >
                    {difference >= 0 ? '+' : ''}€{difference.toLocaleString('es-ES', {
                        minimumFractionDigits: 2,
                    })}
                </p>
            </div>

            {/* Notes */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas (opcional)
                </label>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    rows={3}
                    placeholder="Observaciones del cierre..."
                />
            </div>

            {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
                <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg"
                >
                    {isLoading ? 'Cerrando...' : 'Confirmar Cierre'}
                </button>
            </div>
        </form>
    );
};
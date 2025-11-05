import React from 'react';

interface Movement {
    id: string;
    type: string;
    amount: number;
    paymentMethod: string;
    description?: string;
    category?: string;
    createdAt: string;
}

interface HistoryListProps {
    movements: Movement[];
}

export const HistoryList: React.FC<HistoryListProps> = ({ movements }) => {
    if (movements.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <p>No hay movimientos registrados</p>
            </div>
        );
    }

    return (
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {movements
                .filter((m) => m.type !== 'OPENING')
                .map((movement) => (
                    <div
                        key={movement.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <span
                                    className={`inline-block w-2 h-2 rounded-full ${movement.type === 'SALE' ? 'bg-green-500' : 'bg-red-500'
                                        }`}
                                ></span>
                                <p className="font-medium text-gray-900">
                                    {movement.description || movement.category || 'Sin descripción'}
                                </p>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                {movement.paymentMethod} · {new Date(movement.createdAt).toLocaleTimeString('es-ES')}
                            </p>
                        </div>
                        <p
                            className={`text-lg font-bold ${movement.type === 'SALE' ? 'text-green-600' : 'text-red-600'
                                }`}
                        >
                            {movement.type === 'SALE' ? '+' : '-'}€
                            {movement.amount.toLocaleString('es-ES', {
                                minimumFractionDigits: 2,
                            })}
                        </p>
                    </div>
                ))}
        </div>
    );
};
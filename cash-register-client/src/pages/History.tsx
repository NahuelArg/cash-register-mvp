import React from 'react';
import { Link } from 'react-router-dom';
import { ClosingHistory } from '../components/ClosingHistory';

export const History: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-6xl mx-auto">
                {/* Header with Back Button */}
                <div className="mb-6">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                    >
                        ← Volver a Caja
                    </Link>
                </div>

                {/* History Component */}
                <ClosingHistory />
            </div>
        </div>
    );
};

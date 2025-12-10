import React, { useEffect, useState } from 'react';
import { cashApi } from '../services/api';

interface Barber {
  id: string;
  name: string;
  isOwner: boolean;
}

interface BarberSelectorProps {
  value: string;
  onChange: (barberId: string) => void;
  required?: boolean;
}

export const BarberSelector: React.FC<BarberSelectorProps> = ({ value, onChange, required = false }) => {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBarbers = async () => {
      try {
        const { data } = await cashApi.getBarbers();
        setBarbers(data);
      } catch (error) {
        console.error('Error loading barbers:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBarbers();
  }, []);

  if (loading) {
    return (
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          👤 Barbero {required && <span className="text-danger-500">*</span>}
        </label>
        <div className="animate-pulse">
          <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        👤 Barbero {required && <span className="text-danger-500">*</span>}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-200 bg-white appearance-none cursor-pointer"
        >
          <option value="">Seleccionar barbero...</option>
          {barbers.map((barber) => (
            <option key={barber.id} value={barber.id}>
              {barber.isOwner ? '👑 ' : '✂️ '}{barber.name} {barber.isOwner ? '(Dueño)' : ''}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          ▼
        </div>
      </div>
    </div>
  );
};

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
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Barbero {required && <span className="text-red-500">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Seleccionar barbero...</option>
        {barbers.map((barber) => (
          <option key={barber.id} value={barber.id}>
            {barber.name} {barber.isOwner ? '(Dueño)' : ''}
          </option>
        ))}
      </select>
    </div>
  );
};

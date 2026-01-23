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
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Barbero {required && <span className="text-danger-500">*</span>}
        </label>
        <div className="animate-pulse">
          <div className="h-10 bg-neutral-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-2">
        Barbero {required && <span className="text-danger-500">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-150 bg-white"
      >
        <option value="">Seleccionar profesional...</option>
        {barbers.map((barber) => (
          <option key={barber.id} value={barber.id}>
            {barber.name} {barber.isOwner ? '(Propietario)' : ''}
          </option>
        ))}
      </select>
    </div>
  );
};

// useReservations.ts - Hook para gestionar reservas
'use client';

import { useState, useEffect } from 'react';
import { reservationsAPI, Reservation } from '@/lib/api';
import toast from 'react-hot-toast';

interface UseReservationsParams {
  status?: string;
  [key: string]: any;
}

interface UseReservationsReturn {
  reservations: Reservation[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateStatus: (id: string, status: string) => Promise<boolean>;
}

export function useReservations(params: UseReservationsParams = {}): UseReservationsReturn {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response: any = await reservationsAPI.getAll(params);
      setReservations(response.reservations || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error cargando reservas:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string): Promise<boolean> => {
    try {
      await reservationsAPI.updateStatus(id, status);
      toast.success('Estado actualizado correctamente');
      fetchReservations();
      return true;
    } catch (err) {
      toast.error('Error al actualizar estado');
      console.error('Error actualizando estado:', err);
      return false;
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [JSON.stringify(params)]);

  return { 
    reservations, 
    loading, 
    error, 
    refetch: fetchReservations,
    updateStatus 
  };
}

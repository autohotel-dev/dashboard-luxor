// useUsers.ts - Hook para gestionar usuarios
'use client';

import { useState, useEffect } from 'react';
import { usersAPI, User } from '@/lib/api';
import toast from 'react-hot-toast';

// Re-exportar User para conveniencia
export type { User };

interface UseUsersParams {
  status?: string;
  limit?: number;
  [key: string]: any;
}

interface UseUsersReturn {
  users: User[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  getByPhone: (phone: string) => Promise<User | null>;
}

export function useUsers(params: UseUsersParams = {}): UseUsersReturn {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response: any = await usersAPI.getAll(params);
      setUsers(response.users || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error cargando usuarios:', err);
    } finally {
      setLoading(false);
    }
  };

  const getByPhone = async (phone: string): Promise<User | null> => {
    try {
      const response: any = await usersAPI.getByPhone(phone);
      return response.user || null;
    } catch (err) {
      toast.error('Error al buscar usuario');
      console.error('Error buscando usuario:', err);
      return null;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [JSON.stringify(params)]);

  return { 
    users, 
    loading, 
    error, 
    refetch: fetchUsers,
    getByPhone 
  };
}

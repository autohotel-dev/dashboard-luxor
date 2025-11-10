// useMessages.ts - Hook para gestionar mensajes
'use client';

import { useState, useEffect } from 'react';
import { messagesAPI, Message } from '@/lib/api';
import toast from 'react-hot-toast';

// Re-exportar Message para conveniencia
export type { Message };

interface UseMessagesParams {
  phone?: string;
  limit?: number;
  [key: string]: any;
}

interface UseMessagesReturn {
  messages: Message[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  getByUser: (phone: string) => Promise<Message[]>;
}

export function useMessages(params: UseMessagesParams = {}): UseMessagesReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      if (params.phone) {
        // Si hay un teléfono específico, obtener mensajes de ese usuario
        const response: any = await messagesAPI.getByUser(params.phone, params.limit || 100);
        setMessages(response.messages || []);
      } else {
        // Si no, obtener estadísticas o últimos mensajes
        const response: any = await messagesAPI.getStats();
        setMessages(response.recentMessages || []);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error cargando mensajes:', err);
    } finally {
      setLoading(false);
    }
  };

  const getByUser = async (phone: string): Promise<Message[]> => {
    try {
      const response: any = await messagesAPI.getByUser(phone, params.limit || 100);
      return response.messages || [];
    } catch (err) {
      toast.error('Error al buscar mensajes');
      console.error('Error buscando mensajes:', err);
      return [];
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [JSON.stringify(params)]);

  return { 
    messages, 
    loading, 
    error, 
    refetch: fetchMessages,
    getByUser 
  };
}

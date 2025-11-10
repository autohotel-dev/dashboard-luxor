// useSearch.ts - Hook para búsqueda global
'use client';

import { useState } from 'react';
import { searchAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export interface SearchResult {
  type: 'reservation' | 'user' | 'message' | 'notification';
  id: string;
  title: string;
  subtitle: string;
  description?: string;
  metadata?: any;
  relevance?: number;
}

interface UseSearchReturn {
  results: SearchResult[];
  loading: boolean;
  error: string | null;
  search: (query: string, type?: string) => Promise<void>;
  clear: () => void;
}

export function useSearch(): UseSearchReturn {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (query: string, type: string = 'all') => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response: any = await searchAPI.search(query, type);
      setResults(response.results || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en la búsqueda');
      toast.error('Error al realizar la búsqueda');
      console.error('Error en búsqueda:', err);
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setResults([]);
    setError(null);
  };

  return { 
    results, 
    loading, 
    error, 
    search,
    clear
  };
}

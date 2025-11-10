// useRealtime.ts - Hook para métricas en tiempo real
'use client';

import { useState, useEffect } from 'react';
import { dashboardAPI, RealtimeMetrics } from '@/lib/api';

interface UseRealtimeReturn {
  data: RealtimeMetrics | null;
  loading: boolean;
}

export function useRealtime(interval = 30000): UseRealtimeReturn {
  const [data, setData] = useState<RealtimeMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRealtime = async () => {
      try {
        const response = await dashboardAPI.getRealtime();
        setData(response.realtime);
        setLoading(false);
      } catch (err) {
        console.error('Error cargando datos en tiempo real:', err);
      }
    };

    // Cargar inmediatamente
    fetchRealtime();

    // Actualizar cada X segundos
    const intervalId = setInterval(fetchRealtime, interval);

    return () => clearInterval(intervalId);
  }, [interval]);

  return { data, loading };
}

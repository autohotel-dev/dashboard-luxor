// offline/page.tsx - Página que se muestra cuando no hay conexión
'use client';

import { WifiOff, RefreshCw } from 'lucide-react';
import Button from '@/components/UI/Button';
import Card from '@/components/UI/Card';

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center">
        <div className="py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <WifiOff className="w-12 h-12 text-gray-400" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Sin Conexión
          </h1>
          
          <p className="text-gray-600 mb-6">
            No tienes conexión a internet en este momento. 
            Por favor, verifica tu conexión e intenta nuevamente.
          </p>

          <Button
            variant="primary"
            onClick={handleRetry}
            className="w-full sm:w-auto"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reintentar
          </Button>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Esta aplicación funciona offline con datos cacheados. 
              Para funcionalidad completa, necesitas conexión a internet.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

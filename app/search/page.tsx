// app/search/page.tsx - Busqueda global
import { Suspense } from 'react';
import SearchContent from './SearchContent';
import Loading from '@/components/UI/Loading';

export default function SearchPage() {
  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Busqueda Global</h1>
        <p className="text-gray-600 mt-1">Busca en reservas, usuarios, mensajes y notificaciones</p>
      </div>

      {/* Contenido con Suspense */}
      <Suspense fallback={<Loading size="lg" text="Cargando busqueda..." />}>
        <SearchContent />
      </Suspense>
    </div>
  );
}

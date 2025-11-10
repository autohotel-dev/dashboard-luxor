// app/search/page.tsx - Búsqueda global
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSearch } from '@/hooks/useSearch';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import Loading from '@/components/UI/Loading';
import { 
  Search, 
  CalendarCheck, 
  User, 
  MessageSquare, 
  Bell,
  ArrowRight,
  Filter
} from 'lucide-react';
import Link from 'next/link';
import { formatDateTime, formatCurrency, truncate } from '@/lib/utils';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [typeFilter, setTypeFilter] = useState<'all' | 'reservation' | 'user' | 'message' | 'notification'>('all');
  const { results, loading, error, search, clear } = useSearch();

  useEffect(() => {
    const initialQuery = searchParams.get('q');
    if (initialQuery) {
      setQuery(initialQuery);
      search(initialQuery, typeFilter);
    }
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length >= 2) {
      await search(query, typeFilter);
    }
  };

  const handleClear = () => {
    setQuery('');
    clear();
  };

  // Agrupar resultados por tipo
  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = [];
    }
    acc[result.type].push(result);
    return acc;
  }, {} as Record<string, typeof results>);

  const getIcon = (type: string) => {
    switch (type) {
      case 'reservation':
        return <CalendarCheck className="w-5 h-5 text-blue-600" />;
      case 'user':
        return <User className="w-5 h-5 text-green-600" />;
      case 'message':
        return <MessageSquare className="w-5 h-5 text-purple-600" />;
      case 'notification':
        return <Bell className="w-5 h-5 text-yellow-600" />;
      default:
        return <Search className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      reservation: 'Reserva',
      user: 'Usuario',
      message: 'Mensaje',
      notification: 'Notificación'
    };
    return labels[type] || type;
  };

  const getResultLink = (result: any) => {
    switch (result.type) {
      case 'reservation':
        return `/reservations/${result.id}`;
      case 'user':
        return `/users/${result.metadata?.phone || result.id}`;
      case 'message':
        return `/messages/${result.metadata?.phone || result.id}`;
      case 'notification':
        return `/notifications`;
      default:
        return '#';
    }
  };

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Búsqueda Global</h1>
        <p className="text-gray-600 mt-1">Busca en reservas, usuarios, mensajes y notificaciones</p>
      </div>

      {/* Formulario de Búsqueda */}
      <Card className="mb-6">
        <form onSubmit={handleSearch}>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Campo de búsqueda */}
            <div className="flex-1 flex items-center space-x-4">
              <Search className="w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Buscar por nombre, teléfono, código, email..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>

            {/* Filtro por tipo */}
            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos</option>
                <option value="reservation">Reservas</option>
                <option value="user">Usuarios</option>
                <option value="message">Mensajes</option>
                <option value="notification">Notificaciones</option>
              </select>
            </div>

            {/* Botones */}
            <div className="flex space-x-2">
              <Button type="submit" disabled={loading || query.trim().length < 2}>
                <Search className="w-4 h-4 mr-2" />
                Buscar
              </Button>
              {query && (
                <Button type="button" variant="outline" onClick={handleClear}>
                  Limpiar
                </Button>
              )}
            </div>
          </div>
        </form>

        {/* Ayuda */}
        <div className="mt-4 pt-4 border-t">
          <p className="text-xs text-gray-500">
            💡 <strong>Tips de búsqueda:</strong> Puedes buscar por nombre de cliente, número de teléfono, 
            código de confirmación, email, o palabras clave en mensajes.
          </p>
        </div>
      </Card>

      {/* Error */}
      {error && (
        <Card className="mb-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="font-bold">Error en la búsqueda</p>
            <p>{error}</p>
          </div>
        </Card>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-12">
          <Loading size="lg" text="Buscando..." />
        </div>
      )}

      {/* Resultados */}
      {!loading && query && results.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No se encontraron resultados</p>
            <p className="text-gray-400 text-sm mt-2">
              Intenta con otros términos de búsqueda
            </p>
          </div>
        </Card>
      )}

      {!loading && results.length > 0 && (
        <div className="space-y-6">
          {/* Resumen de resultados */}
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              Se encontraron <span className="font-bold text-gray-900">{results.length}</span> resultados
            </p>
            
            {/* Contador por tipo */}
            <div className="flex items-center space-x-4 text-sm">
              {Object.entries(groupedResults).map(([type, items]) => (
                <div key={type} className="flex items-center space-x-2">
                  {getIcon(type)}
                  <span className="text-gray-600">
                    {items.length} {getTypeLabel(type)}
                    {items.length !== 1 && type === 'reservation' && 's'}
                    {items.length !== 1 && type === 'user' && 's'}
                    {items.length !== 1 && type === 'message' && 's'}
                    {items.length !== 1 && type === 'notification' && 's'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Resultados agrupados por tipo */}
          {Object.entries(groupedResults).map(([type, items]) => (
            <div key={type}>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                {getIcon(type)}
                <span>
                  {getTypeLabel(type)}s ({items.length})
                </span>
              </h2>

              <div className="space-y-3">
                {items.map((result) => (
                  <Card key={result.id} className="hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {/* Tipo */}
                        <div className="flex items-center space-x-2 mb-2">
                          {getIcon(result.type)}
                          <span className="text-xs text-gray-500 uppercase font-medium">
                            {getTypeLabel(result.type)}
                          </span>
                        </div>

                        {/* Título */}
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {result.title}
                        </h3>

                        {/* Subtítulo */}
                        <p className="text-sm text-gray-600 mb-2">
                          {result.subtitle}
                        </p>

                        {/* Descripción */}
                        {result.description && (
                          <p className="text-sm text-gray-500">
                            {truncate(result.description, 150)}
                          </p>
                        )}

                        {/* Metadata adicional */}
                        {result.metadata && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {result.metadata.date && (
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                📅 {formatDateTime(result.metadata.date)}
                              </span>
                            )}
                            {result.metadata.amount && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                💰 {formatCurrency(result.metadata.amount)}
                              </span>
                            )}
                            {result.metadata.status && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                🏷️ {result.metadata.status}
                              </span>
                            )}
                            {result.metadata.phone && (
                              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                📞 {result.metadata.phone}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Acción */}
                      <Link href={getResultLink(result)}>
                        <Button size="sm" variant="outline">
                          Ver detalle
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Búsquedas sugeridas si no hay query */}
      {!query && !loading && (
        <Card>
          <div className="text-center py-8">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              ¿Qué estás buscando?
            </h3>
            <p className="text-gray-600 mb-6">
              Escribe al menos 2 caracteres para comenzar la búsqueda
            </p>

            {/* Búsquedas rápidas sugeridas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
              <button
                onClick={() => {
                  setTypeFilter('reservation');
                  setQuery('confirmada');
                  search('confirmada', 'reservation');
                }}
                className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <CalendarCheck className="w-8 h-8 text-blue-600 mb-2" />
                <span className="text-sm font-medium">Reservas confirmadas</span>
              </button>

              <button
                onClick={() => {
                  setTypeFilter('user');
                  setQuery('activo');
                  search('activo', 'user');
                }}
                className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
              >
                <User className="w-8 h-8 text-green-600 mb-2" />
                <span className="text-sm font-medium">Usuarios activos</span>
              </button>

              <button
                onClick={() => {
                  setTypeFilter('message');
                  const today = new Date().toISOString().split('T')[0];
                  setQuery(today);
                  search(today, 'message');
                }}
                className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
              >
                <MessageSquare className="w-8 h-8 text-purple-600 mb-2" />
                <span className="text-sm font-medium">Mensajes de hoy</span>
              </button>

              <button
                onClick={() => {
                  setTypeFilter('notification');
                  setQuery('urgente');
                  search('urgente', 'notification');
                }}
                className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-colors"
              >
                <Bell className="w-8 h-8 text-yellow-600 mb-2" />
                <span className="text-sm font-medium">Notificaciones urgentes</span>
              </button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

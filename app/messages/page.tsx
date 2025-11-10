// app/messages/page.tsx - Lista de mensajes
'use client';

import { useState } from 'react';
import { useMessages } from '@/hooks/useMessages';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import Loading from '@/components/UI/Loading';
import { formatDateTime, formatRelativeTime, truncate } from '@/lib/utils';
import { 
  MessageSquare, 
  Send, 
  Download, 
  Search,
  Filter,
  Phone,
  Image as ImageIcon,
  FileText
} from 'lucide-react';
import Link from 'next/link';

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [directionFilter, setDirectionFilter] = useState<'all' | 'inbound' | 'outbound'>('all');
  const { messages, loading, error } = useMessages();

  // Filtrar mensajes
  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.phone.includes(searchQuery) ||
      message.body.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDirection = 
      directionFilter === 'all' || message.direction === directionFilter;
    
    return matchesSearch && matchesDirection;
  });

  // Agrupar mensajes por teléfono
  const groupedMessages = filteredMessages.reduce((acc, message) => {
    if (!acc[message.phone]) {
      acc[message.phone] = [];
    }
    acc[message.phone].push(message);
    return acc;
  }, {} as Record<string, typeof messages>);

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-4 h-4" />;
      case 'interactive':
      case 'button':
        return <FileText className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Mensajes</h1>
        <p className="text-gray-600 mt-1">Historial de conversaciones con clientes</p>
      </div>

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="text-center">
            <MessageSquare className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Total Mensajes</p>
            <p className="text-2xl font-bold text-gray-900">{messages.length}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <Download className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Recibidos</p>
            <p className="text-2xl font-bold text-gray-900">
              {messages.filter(m => m.direction === 'inbound').length}
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <Send className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Enviados</p>
            <p className="text-2xl font-bold text-gray-900">
              {messages.filter(m => m.direction === 'outbound').length}
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <Phone className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Conversaciones</p>
            <p className="text-2xl font-bold text-gray-900">
              {Object.keys(groupedMessages).length}
            </p>
          </div>
        </Card>
      </div>

      {/* Filtros y Búsqueda */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Búsqueda */}
          <div className="flex-1 flex items-center space-x-4">
            <Search className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar por teléfono o contenido..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filtro de dirección */}
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={directionFilter}
              onChange={(e) => setDirectionFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos</option>
              <option value="inbound">Recibidos</option>
              <option value="outbound">Enviados</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Error */}
      {error && (
        <Card className="mb-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="font-bold">Error al cargar mensajes</p>
            <p>{error}</p>
          </div>
        </Card>
      )}

      {/* Lista de Mensajes */}
      {loading ? (
        <Loading size="lg" text="Cargando mensajes..." />
      ) : filteredMessages.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {searchQuery || directionFilter !== 'all' 
                ? 'No se encontraron mensajes' 
                : 'No hay mensajes aún'}
            </p>
            {searchQuery && (
              <p className="text-gray-400 text-sm mt-2">
                Intenta con otro término de búsqueda
              </p>
            )}
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Mensajes agrupados por conversación */}
          {Object.entries(groupedMessages).map(([phone, phoneMessages]) => (
            <Card key={phone} className="hover:shadow-lg transition-shadow">
              {/* Header de conversación */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{phone}</h3>
                    <p className="text-sm text-gray-500">
                      {phoneMessages.length} mensaje{phoneMessages.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <Link href={`/messages/${phone}`}>
                  <Button size="sm" variant="outline">
                    Ver conversación completa
                  </Button>
                </Link>
              </div>

              {/* Últimos mensajes */}
              <div className="space-y-3">
                {phoneMessages.slice(0, 3).map((message) => (
                  <div
                    key={message._id}
                    className={`flex ${message.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-2xl px-4 py-3 rounded-lg ${
                        message.direction === 'outbound'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      {/* Tipo de mensaje */}
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={message.direction === 'outbound' ? 'text-blue-200' : 'text-gray-500'}>
                          {getMessageIcon(message.type)}
                        </span>
                        <span className={`text-xs ${message.direction === 'outbound' ? 'text-blue-200' : 'text-gray-500'}`}>
                          {message.type === 'text' ? 'Texto' : 
                           message.type === 'image' ? 'Imagen' : 
                           message.type === 'interactive' ? 'Interactivo' : 'Botón'}
                        </span>
                        <span className={`text-xs ${message.direction === 'outbound' ? 'text-blue-200' : 'text-gray-500'}`}>
                          •
                        </span>
                        <span className={`text-xs ${message.direction === 'outbound' ? 'text-blue-200' : 'text-gray-500'}`}>
                          {formatRelativeTime(message.timestamp)}
                        </span>
                      </div>

                      {/* Contenido */}
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {message.type === 'image' && message.metadata?.caption
                          ? message.metadata.caption
                          : truncate(message.body, 200)}
                      </p>

                      {/* Metadata */}
                      {message.metadata?.mediaUrl && (
                        <div className="mt-2 text-xs opacity-75">
                          📎 Archivo adjunto
                        </div>
                      )}

                      {/* Status */}
                      {message.direction === 'outbound' && message.status && (
                        <div className="mt-2 text-xs text-right opacity-75">
                          {message.status === 'sent' && '✓ Enviado'}
                          {message.status === 'delivered' && '✓✓ Entregado'}
                          {message.status === 'read' && '✓✓ Leído'}
                          {message.status === 'failed' && '✗ Fallido'}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {phoneMessages.length > 3 && (
                  <p className="text-center text-sm text-gray-500">
                    + {phoneMessages.length - 3} mensaje{phoneMessages.length - 3 !== 1 ? 's' : ''} más
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Total */}
      {!loading && filteredMessages.length > 0 && (
        <div className="mt-6 text-center text-gray-600">
          {searchQuery || directionFilter !== 'all' ? (
            <>
              Mostrando <span className="font-semibold">{filteredMessages.length}</span> de{' '}
              <span className="font-semibold">{messages.length}</span> mensajes
            </>
          ) : (
            <>
              Total: <span className="font-semibold">{messages.length}</span> mensajes en{' '}
              <span className="font-semibold">{Object.keys(groupedMessages).length}</span> conversaciones
            </>
          )}
        </div>
      )}
    </div>
  );
}

// app/messages/[phone]/page.tsx - Conversación completa
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useMessages, Message } from '@/hooks/useMessages';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import Loading from '@/components/UI/Loading';
import { formatDateTime, formatRelativeTime } from '@/lib/utils';
import { 
  ArrowLeft, 
  Phone, 
  MessageSquare,
  Image as ImageIcon,
  FileText,
  Download
} from 'lucide-react';
import Link from 'next/link';

export default function ConversationPage() {
  const params = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { getByUser } = useMessages();

  useEffect(() => {
    fetchMessages();
  }, [params.phone]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await getByUser(params.phone as string);
      // Ordenar por fecha (más antiguos primero)
      const sorted = data.sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      setMessages(sorted);
    } catch (error) {
      console.error('Error al cargar mensajes:', error);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="p-4 md:p-8">
        <Loading size="lg" text="Cargando conversación..." />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Link href="/messages">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Phone className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{params.phone}</h1>
              <p className="text-gray-600 text-sm">
                {messages.length} mensaje{messages.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex space-x-3">
          <Link href={`/users/${params.phone}`}>
            <Button variant="outline" size="sm">
              Ver perfil
            </Button>
          </Link>
          <Link href={`/reservations?user=${params.phone}`}>
            <Button variant="outline" size="sm">
              Ver reservas
            </Button>
          </Link>
        </div>
      </div>

      {/* Conversación */}
      {messages.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No hay mensajes en esta conversación</p>
          </div>
        </Card>
      ) : (
        <Card className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {messages.map((message, index) => {
              // Mostrar fecha cuando cambia el día
              const showDate = index === 0 || 
                new Date(messages[index - 1].timestamp).toDateString() !== 
                new Date(message.timestamp).toDateString();

              return (
                <div key={message._id}>
                  {/* Separador de fecha */}
                  {showDate && (
                    <div className="flex items-center justify-center my-6">
                      <div className="bg-gray-200 px-4 py-2 rounded-full">
                        <p className="text-xs text-gray-600 font-medium">
                          {formatDateTime(message.timestamp).split(',')[0]}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Mensaje */}
                  <div
                    className={`flex ${message.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-md px-4 py-3 rounded-lg ${
                        message.direction === 'outbound'
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-gray-100 text-gray-900 rounded-bl-none'
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
                      </div>

                      {/* Contenido */}
                      <div className="mb-2">
                        {message.type === 'image' && message.metadata?.mediaUrl ? (
                          <div className="space-y-2">
                            <div className="bg-black bg-opacity-20 rounded p-2">
                              <ImageIcon className="w-16 h-16 mx-auto opacity-75" />
                              <p className="text-xs text-center mt-2">Imagen enviada</p>
                            </div>
                            {message.metadata.caption && (
                              <p className="text-sm whitespace-pre-wrap break-words">
                                {message.metadata.caption}
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm whitespace-pre-wrap break-words">
                            {message.body}
                          </p>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between text-xs opacity-75">
                        <span>
                          {new Date(message.timestamp).toLocaleTimeString('es-MX', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        
                        {message.direction === 'outbound' && message.status && (
                          <span className="ml-2">
                            {message.status === 'sent' && '✓'}
                            {message.status === 'delivered' && '✓✓'}
                            {message.status === 'read' && '✓✓'}
                            {message.status === 'failed' && '✗'}
                          </span>
                        )}
                      </div>

                      {/* Archivo adjunto */}
                      {message.metadata?.mediaUrl && (
                        <div className="mt-2 pt-2 border-t border-opacity-20">
                          <a
                            href={message.metadata.mediaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center space-x-2 text-xs ${
                              message.direction === 'outbound' 
                                ? 'text-blue-100 hover:text-white' 
                                : 'text-blue-600 hover:text-blue-800'
                            }`}
                          >
                            <Download className="w-3 h-3" />
                            <span>Ver archivo original</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Estadísticas de la conversación */}
          <div className="mt-6 pt-6 border-t">
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <p className="text-gray-500">Total</p>
                <p className="font-bold text-gray-900">{messages.length}</p>
              </div>
              <div>
                <p className="text-gray-500">Recibidos</p>
                <p className="font-bold text-green-600">
                  {messages.filter(m => m.direction === 'inbound').length}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Enviados</p>
                <p className="font-bold text-blue-600">
                  {messages.filter(m => m.direction === 'outbound').length}
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

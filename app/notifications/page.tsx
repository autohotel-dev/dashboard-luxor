// app/notifications/page.tsx - Notificaciones
'use client';

import { useState, useEffect } from 'react';
import { notificationsAPI } from '@/lib/api';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import Loading from '@/components/UI/Loading';
import { formatRelativeTime } from '@/lib/utils';
import { Bell, BellOff, Check, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Notification {
  _id: string;
  type: string;
  recipientPhone: string;
  reservationId?: string;
  status: string;
  message: string;
  metadata?: {
    customerName?: string;
    customerPhone?: string;
    totalAmount?: number;
    [key: string]: any;
  };
  read: boolean;
  priority?: string;
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'unread' | 'all'>('unread');

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data: any = filter === 'unread' 
        ? await notificationsAPI.getUnread()
        : await notificationsAPI.getAll({ limit: 50 });
      setNotifications(data.notifications || []);
    } catch (error) {
      toast.error('Error al cargar notificaciones');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await notificationsAPI.markAsRead(id);
      toast.success('Marcada como leída');
      fetchNotifications();
    } catch (error) {
      toast.error('Error al marcar como leída');
    }
  };

  const getNotificationIcon = (type: string): string => {
    switch (type) {
      case 'reservation_hotel':
        return '🏨';
      case 'reservation_confirmation':
        return '✅';
      case 'payment_received':
        return '💰';
      case 'payment_instructions':
        return '📋';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (priority?: string): string => {
    switch (priority) {
      case 'high':
        return 'border-l-4 border-red-500';
      case 'medium':
        return 'border-l-4 border-yellow-500';
      case 'low':
        return 'border-l-4 border-blue-500';
      default:
        return 'border-l-4 border-gray-300';
    }
  };

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Notificaciones</h1>
        <p className="text-gray-600 mt-1">Gestiona las notificaciones del sistema</p>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant={filter === 'unread' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('unread')}
          >
            <BellOff className="w-4 h-4 mr-2" />
            No leídas
          </Button>
          <Button
            variant={filter === 'all' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            <Bell className="w-4 h-4 mr-2" />
            Todas
          </Button>
        </div>
      </Card>

      {/* Lista de Notificaciones */}
      {loading ? (
        <Loading size="lg" text="Cargando notificaciones..." />
      ) : notifications.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <BellOff className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No hay notificaciones</p>
            <p className="text-gray-400 text-sm mt-2">
              {filter === 'unread' 
                ? 'Todas las notificaciones han sido leídas' 
                : 'No hay notificaciones en el sistema'}
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card 
              key={notification._id} 
              className={`hover:shadow-lg transition-shadow ${getNotificationColor(notification.priority)} ${
                !notification.read ? 'bg-blue-50' : 'bg-white'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">
                          {notification.type.replace('_', ' ').toUpperCase()}
                        </h3>
                        {!notification.read && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Nueva
                          </span>
                        )}
                        {notification.priority === 'high' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Urgente
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatRelativeTime(notification.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Mensaje */}
                  <p className="text-gray-700 text-sm whitespace-pre-wrap">
                    {notification.message}
                  </p>

                  {/* Metadata */}
                  {notification.metadata && (
                    <div className="mt-3 p-3 bg-gray-50 rounded text-xs space-y-1">
                      {notification.metadata.customerName && (
                        <p>👤 Cliente: <span className="font-medium">{notification.metadata.customerName}</span></p>
                      )}
                      {notification.metadata.customerPhone && (
                        <p>📞 Teléfono: <span className="font-medium">{notification.metadata.customerPhone}</span></p>
                      )}
                      {notification.metadata.totalAmount && (
                        <p>💰 Monto: <span className="font-medium">${notification.metadata.totalAmount}</span></p>
                      )}
                    </div>
                  )}
                </div>

                {/* Acción */}
                {!notification.read && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => markAsRead(notification._id)}
                    className="ml-4"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Marcar leída
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Total */}
      {!loading && notifications.length > 0 && (
        <div className="mt-6 text-center text-gray-600">
          Total: <span className="font-semibold">{notifications.length}</span> notificaciones
        </div>
      )}
    </div>
  );
}

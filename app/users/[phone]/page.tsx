// app/users/[phone]/page.tsx - Detalle de usuario
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { usersAPI, reservationsAPI, messagesAPI, Reservation, User } from '@/lib/api';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import Loading from '@/components/UI/Loading';
import StatusBadge from '@/components/Reservations/StatusBadge';
import { 
  formatCurrency, 
  formatDateTime, 
  formatRelativeTime,
  getPackageName,
  getRoomName
} from '@/lib/utils';
import { 
  ArrowLeft, 
  User as UserIcon, 
  Phone, 
  Mail, 
  Calendar,
  DollarSign,
  MessageSquare,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function UserDetailPage() {
  const params = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [messageCount, setMessageCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, [params.phone]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const phone = params.phone as string;

      // Cargar datos del usuario
      const userData: any = await usersAPI.getByPhone(phone);
      setUser(userData.user);

      // Cargar reservas del usuario
      const reservationsData: any = await reservationsAPI.getByUser(phone);
      setReservations(reservationsData.reservations || []);

      // Cargar mensajes del usuario
      const messagesData: any = await messagesAPI.getByUser(phone);
      setMessageCount(messagesData.messages?.length || 0);

    } catch (error) {
      toast.error('Error al cargar datos del usuario');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8">
        <Loading size="lg" text="Cargando perfil..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-4 md:p-8">
        <Card>
          <p className="text-center text-gray-500">Usuario no encontrado</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Link href="/users">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Perfil de Usuario</h1>
            <p className="text-gray-600 mt-1">{user.phone}</p>
          </div>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-medium ${
          user.status === 'active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {user.status === 'active' ? '✓ Activo' : '○ Inactivo'}
        </span>
      </div>

      {/* Información Principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Datos Personales */}
        <Card title="👤 Datos Personales">
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Nombre</p>
              <p className="font-semibold text-lg text-gray-900">{user.name || 'No especificado'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 flex items-center">
                <Phone className="w-4 h-4 mr-1" />
                Teléfono
              </p>
              <p className="font-medium text-gray-900">{user.phone}</p>
            </div>
            {user.email && (
              <div>
                <p className="text-sm text-gray-500 flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  Email
                </p>
                <p className="font-medium text-gray-900">{user.email}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Estadísticas */}
        <Card title="📊 Estadísticas">
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Total de Reservas</p>
              <p className="text-3xl font-bold text-blue-600">{user.totalReservations || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Gastado</p>
              <p className="text-3xl font-bold text-green-600">
                {formatCurrency(user.totalSpent || 0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Promedio por Reserva</p>
              <p className="text-xl font-bold text-purple-600">
                {user.totalReservations > 0
                  ? formatCurrency((user.totalSpent || 0) / user.totalReservations)
                  : '$0.00'
                }
              </p>
            </div>
          </div>
        </Card>

        {/* Actividad */}
        <Card title="🕒 Actividad">
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500 flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Cliente desde
              </p>
              <p className="font-medium text-gray-900">{formatDateTime(user.firstContact)}</p>
              <p className="text-xs text-gray-500 mt-1">
                {formatRelativeTime(user.firstContact)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Último contacto</p>
              <p className="font-medium text-gray-900">{formatDateTime(user.lastContact)}</p>
              <p className="text-xs text-gray-500 mt-1">
                {formatRelativeTime(user.lastContact)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 flex items-center">
                <MessageSquare className="w-4 h-4 mr-1" />
                Mensajes
              </p>
              <p className="text-2xl font-bold text-blue-600">{messageCount}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Preferencias */}
      {user.preferences && (
        <Card title="❤️ Preferencias" className="mb-6">
          <div className="grid grid-cols-2 gap-4">
            {user.preferences.packageType && (
              <div>
                <p className="text-sm text-gray-500">Paquete Preferido</p>
                <p className="font-semibold text-lg text-purple-600">
                  {getPackageName(user.preferences.packageType)}
                </p>
              </div>
            )}
            {user.preferences.roomType && (
              <div>
                <p className="text-sm text-gray-500">Habitación Preferida</p>
                <p className="font-semibold text-lg text-blue-600">
                  {getRoomName(user.preferences.roomType)}
                </p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Historial de Reservas */}
      <Card title="📅 Historial de Reservas">
        {reservations.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            Este usuario no tiene reservas aún
          </p>
        ) : (
          <div className="space-y-4">
            {reservations.map((reservation) => (
              <div
                key={reservation._id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {getPackageName(reservation.packageType)}
                      </h4>
                      <StatusBadge status={reservation.status} />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Habitación</p>
                        <p className="font-medium text-gray-900">{getRoomName(reservation.roomType)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Fecha</p>
                        <p className="font-medium text-gray-900">{formatDateTime(reservation.date)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Monto</p>
                        <p className="font-bold text-green-600">
                          {formatCurrency(reservation.totalAmount)}
                        </p>
                      </div>
                    </div>

                    {reservation.confirmationCode && (
                      <p className="text-xs text-gray-500 mt-2">
                        Código: <span className="font-mono">{reservation.confirmationCode}</span>
                      </p>
                    )}
                  </div>

                  <Link href={`/reservations/${reservation._id}`}>
                    <Button size="sm" variant="outline">
                      Ver detalle
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {reservations.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600 text-center">
              Total de reservas: <span className="font-semibold">{reservations.length}</span>
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}

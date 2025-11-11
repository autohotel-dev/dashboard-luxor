// app/reservations/page.tsx - Lista de reservas
'use client';

import { useState } from 'react';
import { useReservations } from '@/hooks/useReservations';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import Loading from '@/components/UI/Loading';
import StatusBadge from '@/components/Reservations/StatusBadge';
import { formatCurrency, formatDate, getPackageName, getRoomName } from '@/lib/utils';
import { Filter, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ReservationsPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const { reservations, loading, updateStatus } = useReservations({ status: statusFilter });

  const handleConfirm = async (id: string) => {
    const success = await updateStatus(id, 'confirmed');
    if (success) {
      toast.success('Reserva confirmada');
    }
  };

  const handleCancel = async (id: string) => {
    if (confirm('¿Estás seguro de cancelar esta reserva?')) {
      const success = await updateStatus(id, 'cancelled');
      if (success) {
        toast.success('Reserva cancelada');
      }
    }
  };

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Reservas</h1>
        <p className="text-gray-600 mt-1">Gestiona todas las reservas del hotel</p>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los estados</option>
            <option value="pending_payment">Pendiente de pago</option>
            <option value="payment_received">Pago recibido</option>
            <option value="confirmed">Confirmada</option>
            <option value="cancelled">Cancelada</option>
            <option value="completed">Completada</option>
          </select>
        </div>
      </Card>

      {/* Lista de Reservas */}
      {loading ? (
        <Loading size="lg" text="Cargando reservas..." />
      ) : reservations.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No hay reservas para mostrar</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {reservations.map((reservation) => (
            <Card key={reservation._id} className="hover:shadow-lg transition-shadow">
              <div className="flex flex-col">
                {/* Información principal */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {reservation.customerName}
                    </h3>
                    <StatusBadge status={reservation.status} />
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-gray-500">Paquete</p>
                      <p className="font-medium text-gray-900">{getPackageName(reservation.packageType)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Habitación</p>
                      <p className="font-medium text-gray-900">{getRoomName(reservation.roomType)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Fecha</p>
                      <p className="font-medium text-gray-900">{formatDate(reservation.date)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Monto</p>
                      <p className="font-bold text-green-700">{formatCurrency(reservation.totalAmount)}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600 mb-4">
                    <span className="truncate">📞 {reservation.userPhone}</span>
                    <span className="truncate">📧 {reservation.customerEmail}</span>
                    <span>👥 {reservation.numberOfGuests} personas</span>
                  </div>

                  {reservation.confirmationCode && (
                    <div className="mb-4 text-sm">
                      <span className="text-gray-500">Código: </span>
                      <span className="font-mono font-medium text-gray-900">{reservation.confirmationCode}</span>
                    </div>
                  )}
                </div>

                {/* Acciones */}
                <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-gray-200">
                  <Link href={`/reservations/${reservation._id}`} className="flex-1">
                    <Button size="sm" variant="outline" className="w-full lg:w-auto flex items-center justify-center">
                      Ver detalle
                    </Button>
                  </Link>
                  
                  {reservation.status === 'payment_received' && (
                    <Button 
                      size="sm" 
                      variant="success"
                      onClick={() => handleConfirm(reservation._id)}
                      className="w-full sm:w-auto flex items-center justify-center"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Confirmar
                    </Button>
                  )}
                  
                  {reservation.status !== 'cancelled' && reservation.status !== 'completed' && (
                    <Button 
                      size="sm" 
                      variant="danger"
                      onClick={() => handleCancel(reservation._id)}
                      className="w-full sm:w-auto flex items-center justify-center"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Cancelar
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Total */}
      {!loading && reservations.length > 0 && (
        <div className="mt-6 text-center text-gray-600">
          Total: <span className="font-semibold">{reservations.length}</span> reservas
        </div>
      )}
    </div>
  );
}

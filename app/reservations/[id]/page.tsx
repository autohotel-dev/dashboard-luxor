// app/reservations/[id]/page.tsx - Detalle de reserva
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { reservationsAPI, messagesAPI, Reservation } from '@/lib/api';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import Loading from '@/components/UI/Loading';
import StatusBadge from '@/components/Reservations/StatusBadge';
import {
  formatCurrency,
  formatDateTime,
  getPackageName,
  getRoomName
} from '@/lib/utils';
import { ArrowLeft, CheckCircle, Eye, XCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ReservationDetailPage() {
  const params = useParams();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservation();
  }, [params.id]);

  const fetchReservation = async () => {
    try {
      const data: any = await reservationsAPI.getById(params.id as string);
      setReservation(data.reservation);
    } catch (error) {
      toast.error('Error al cargar la reserva');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    if (!reservation) return;

    try {
      await reservationsAPI.updateStatus(params.id as string, status);
      
      // Enviar notificación por WhatsApp
      let message = '';
      
      if (status === 'confirmed') {
        message = `🎉 ¡Excelente noticia! Tu pago ha sido verificado y aceptado correctamente.\n\n` +
          `✅ Tu reserva ha sido confirmada:\n` +
          `📅 Fecha: ${new Date(reservation.date).toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n` +
          `🕐 Hora de entrada: ${reservation.checkInTime}\n` +
          `🏨 Habitación: ${getRoomName(reservation.roomType)}\n` +
          `📦 Paquete: ${getPackageName(reservation.packageType)}\n` +
          `👥 Huéspedes: ${reservation.numberOfGuests}\n` +
          `💰 Total: ${formatCurrency(reservation.totalAmount)}\n` +
          `🔑 Código de confirmación: *${reservation.confirmationCode}*\n\n` +
          `¡Te esperamos! Si tienes alguna duda, no dudes en contactarnos. 😊`;
      } else if (status === 'cancelled') {
        message = `❌ Lamentablemente tu reserva ha sido cancelada.\n\n` +
          `📋 Detalles de la reserva cancelada:\n` +
          `📅 Fecha: ${new Date(reservation.date).toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n` +
          `🔑 Código: ${reservation.confirmationCode}\n\n` +
          `Si tienes alguna pregunta o deseas hacer una nueva reserva, estamos para ayudarte. 💙`;
      }
      
      // Enviar mensaje solo si hay un mensaje preparado
      if (message && reservation.userPhone) {
        try {
          await messagesAPI.sendMessage(reservation.userPhone, message);
          toast.success('Estado actualizado y cliente notificado por WhatsApp');
        } catch (msgError) {
          console.error('Error al enviar mensaje:', msgError);
          toast.success('Estado actualizado (mensaje no enviado)');
        }
      } else {
        toast.success('Estado actualizado');
      }
      
      fetchReservation();
    } catch (error) {
      toast.error('Error al actualizar estado');
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8">
        <Loading size="lg" text="Cargando reserva..." />
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="p-4 md:p-8">
        <Card>
          <p className="text-center text-gray-500">Reserva no encontrada</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Link href="/reservations">
            <Button variant="outline" size="sm" className="flex items-center justify-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Detalle de Reserva</h1>
            <p className="text-gray-600 mt-1">ID: {reservation._id}</p>
          </div>
        </div>
        <StatusBadge status={reservation.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Información del Cliente */}
        <Card title="👤 Cliente">
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Nombre</p>
              <p className="font-semibold text-lg text-gray-900">{reservation.customerName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Teléfono</p>
              <p className="font-medium text-gray-900">{reservation.userPhone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-900">{reservation.customerEmail}</p>
            </div>
          </div>
        </Card>

        {/* Información de la Reserva */}
        <Card title="📅 Reserva">
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Paquete</p>
              <p className="font-semibold text-lg text-gray-900">{getPackageName(reservation.packageType)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Habitación</p>
              <p className="font-medium text-gray-900">{getRoomName(reservation.roomType)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Fecha de entrada</p>
              <p className="font-medium text-gray-900">{formatDateTime(reservation.date)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Hora de entrada</p>
              <p className="font-medium text-gray-900">{reservation.checkInTime}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Número de huéspedes</p>
              <p className="font-medium text-gray-900">{reservation.numberOfGuests} personas</p>
            </div>
          </div>
        </Card>

        {/* Detalles de Pago */}
        <Card title="💰 Pago">
          <div className="flex flex-row items-start lg:justify-around">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Monto Total</p>
                <p className="font-bold text-2xl text-green-600">
                  {formatCurrency(reservation.totalAmount)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Estado</p>
                <StatusBadge status={reservation.status} />
              </div>
              {reservation.confirmationCode && (
                <div>
                  <p className="text-sm text-gray-500">Código de Confirmación</p>
                  <p className="font-mono font-bold text-lg text-gray-900">{reservation.confirmationCode}</p>
                </div>
              )}
              {reservation.paymentDeadline && (
                <div>
                  <p className="text-sm text-gray-500">Deadline de Pago</p>
                  <p className="font-medium text-yellow-700">
                    {formatDateTime(reservation.paymentDeadline)}
                  </p>
                </div>
              )}
              {reservation.paidAt && (
                <div>
                  <p className="text-sm text-gray-500">Pagado el</p>
                  <p className="font-medium text-green-700">
                    {formatDateTime(reservation.paidAt)}
                  </p>
                </div>
              )}
              <div className="flex lg:hidden items-center justify-between">
                {reservation.paymentProof && (
                  <div>
                    <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full flex items-center justify-center"
                    onClick={() => window.open(reservation.paymentProof, '_blank')}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Comprobante
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="hidden lg:flex items-center justify-between">
              {reservation.paymentProof && (
                <div>
                  <p className="text-sm text-gray-500">Comprobante de Pago</p>
                  <Image 
                  src={reservation.paymentProof} 
                  alt="Comprobante de Pago" 
                  width={200} 
                  height={200} 
                  className="w-full h-auto"
                  onClick={() => window.open(reservation.paymentProof, '_blank')}
                  />
                </div>
              )}
            </div>
          </div>

        </Card>

        {/* Solicitudes Especiales */}
        <Card title="📝 Información Adicional">
          <div className="space-y-3">
            {reservation.specialRequests && (
              <div>
                <p className="text-sm text-gray-500">Solicitudes Especiales</p>
                <p className="font-medium text-gray-900">{reservation.specialRequests}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500">Creada el</p>
              <p className="font-medium text-gray-900">{formatDateTime(reservation.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Última actualización</p>
              <p className="font-medium text-gray-900">{formatDateTime(reservation.updatedAt)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Acciones */}
      <Card className="mt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Acciones</h3>
          <div className="flex space-x-3">
            {reservation.status === 'payment_received' && (
              <Button
                variant="success"
                onClick={() => handleUpdateStatus('confirmed')}
                className="flex items-center justify-center"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirmar Reserva
              </Button>
            )}

            {reservation.status !== 'cancelled' && reservation.status !== 'completed' && (
              <Button
                variant="danger"
                onClick={() => {
                  if (confirm('¿Estás seguro de cancelar esta reserva?')) {
                    handleUpdateStatus('cancelled');
                  }
                }}
                className="flex items-center justify-center"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Cancelar Reserva
              </Button>
            )}

            {reservation.status === 'confirmed' && (
              <Button
                variant="primary"
                onClick={() => handleUpdateStatus('completed')}
                className="flex items-center justify-center"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Marcar como Completada
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

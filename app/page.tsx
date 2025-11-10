// page.tsx - Dashboard principal
'use client';

import { useDashboard } from '@/hooks/useDashboard';
import { useRealtime } from '@/hooks/useRealtime';
import StatsCard from '@/components/Dashboard/StatsCard';
import Card from '@/components/UI/Card';
import Loading from '@/components/UI/Loading';
import { 
  CalendarCheck, 
  Users, 
  DollarSign, 
  TrendingUp,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function DashboardPage() {
  const { data: dashboard, loading, error } = useDashboard();
  const { data: realtime } = useRealtime(30000);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading size="lg" text="Cargando dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error al cargar el dashboard</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Bienvenido al panel de control de Auto Hotel Luxor</p>
      </div>

      {/* Métricas en Tiempo Real */}
      {realtime && (
        <Card title="⚡ En Tiempo Real" className="mb-6">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Mensajes (5 min)</p>
              <p className="text-2xl font-bold text-blue-600">{realtime.messagesLast5Min}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Reservas Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600">{realtime.pendingReservations}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Estado Sistema</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                realtime.systemStatus === 'healthy' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {realtime.systemStatus === 'healthy' ? '✓ Saludable' : '✗ Con problemas'}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600">BD Conectada</p>
              <p className="text-2xl font-bold">{realtime.dbConnected ? '✅' : '❌'}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Estadísticas de Hoy */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">📅 Hoy</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Reservas"
            value={dashboard?.today?.reservations || 0}
            icon={CalendarCheck}
            color="blue"
          />
          <StatsCard
            title="Nuevos Usuarios"
            value={dashboard?.today?.newUsers || 0}
            icon={Users}
            color="green"
          />
          <StatsCard
            title="Revenue"
            value={formatCurrency(dashboard?.today?.revenue || 0)}
            icon={DollarSign}
            color="purple"
          />
        </div>
      </div>

      {/* Estadísticas de la Semana */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">📊 Esta Semana</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Reservas"
            value={dashboard?.week?.reservations || 0}
            subtitle="Últimos 7 días"
            icon={CalendarCheck}
            color="blue"
          />
          <StatsCard
            title="Nuevos Usuarios"
            value={dashboard?.week?.newUsers || 0}
            subtitle="Últimos 7 días"
            icon={Users}
            color="green"
          />
          <StatsCard
            title="Revenue"
            value={formatCurrency(dashboard?.week?.revenue || 0)}
            subtitle="Últimos 7 días"
            icon={DollarSign}
            color="purple"
          />
        </div>
      </div>

      {/* Estadísticas del Mes */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">📈 Este Mes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Reservas"
            value={dashboard?.month?.reservations || 0}
            subtitle="Mes actual"
            icon={CalendarCheck}
            color="blue"
          />
          <StatsCard
            title="Nuevos Usuarios"
            value={dashboard?.month?.newUsers || 0}
            subtitle="Mes actual"
            icon={Users}
            color="green"
          />
          <StatsCard
            title="Revenue"
            value={formatCurrency(dashboard?.month?.revenue || 0)}
            subtitle="Mes actual"
            icon={DollarSign}
            color="purple"
          />
        </div>
      </div>

      {/* Métricas Adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="🏆 Más Populares">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Paquete más vendido</p>
              <p className="text-xl font-bold text-blue-600">
                {dashboard?.topPackage === 'deseo' && '💝 Paquete Deseo'}
                {dashboard?.topPackage === 'enamorados' && '❤️ Paquete Enamorados'}
                {dashboard?.topPackage === 'premium' && '⭐ Paquete Premium'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Habitación más reservada</p>
              <p className="text-xl font-bold text-purple-600">
                {dashboard?.topRoom?.includes('jacuzzi') && '🛁 Master Suite Jacuzzi'}
                {dashboard?.topRoom?.includes('alberca') && '🏊 Master Suite Alberca'}
                {dashboard?.topRoom?.includes('sencilla') && '🛏️ Master Suite Sencilla'}
              </p>
            </div>
          </div>
        </Card>

        <Card title="📊 Métricas">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tasa de Conversión</p>
              <div className="flex items-center">
                <p className="text-3xl font-bold text-green-600">
                  {dashboard?.conversionRate || 0}%
                </p>
                <TrendingUp className="w-6 h-6 text-green-600 ml-2" />
              </div>
            </div>
            <div className="pt-4 border-t">
              <p className="text-xs text-gray-500">
                💡 La tasa de conversión indica el porcentaje de usuarios que completan una reserva
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

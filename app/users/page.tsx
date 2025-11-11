// app/users/page.tsx - Lista de usuarios
'use client';

import { useState } from 'react';
import { useUsers } from '@/hooks/useUsers';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import Loading from '@/components/UI/Loading';
import { formatCurrency, formatDateTime, formatRelativeTime } from '@/lib/utils';
import { Search, User as UserIcon, Phone, Mail, Calendar, DollarSign } from 'lucide-react';
import Link from 'next/link';

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { users, loading, error } = useUsers();

  // Filtrar usuarios por búsqueda
  const filteredUsers = users.filter(user => 
    user.phone.includes(searchQuery) ||
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Usuarios</h1>
        <p className="text-gray-600 mt-1">Gestiona todos los usuarios del sistema</p>
      </div>

      {/* Búsqueda */}
      <Card className="mb-6">
        <div className="flex items-center space-x-4">
          <Search className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar por teléfono, nombre o email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </Card>

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="text-center">
            <UserIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Total Usuarios</p>
            <p className="text-2xl font-bold text-gray-900">{users.length}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Revenue Total</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(users.reduce((sum, u) => sum + (u.totalSpent || 0), 0))}
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Reservas Total</p>
            <p className="text-2xl font-bold text-gray-900">
              {users.reduce((sum, u) => sum + (u.totalReservations || 0), 0)}
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <UserIcon className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Promedio por Usuario</p>
            <p className="text-2xl font-bold text-gray-900">
              {users.length > 0 
                ? formatCurrency(users.reduce((sum, u) => sum + (u.totalSpent || 0), 0) / users.length)
                : '$0.00'
              }
            </p>
          </div>
        </Card>
      </div>

      {/* Error */}
      {error && (
        <Card className="mb-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="font-bold">Error al cargar usuarios</p>
            <p>{error}</p>
          </div>
        </Card>
      )}

      {/* Lista de Usuarios */}
      {loading ? (
        <Loading size="lg" text="Cargando usuarios..." />
      ) : filteredUsers.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <UserIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {searchQuery ? 'No se encontraron usuarios' : 'No hay usuarios registrados'}
            </p>
            {searchQuery && (
              <p className="text-gray-400 text-sm mt-2">
                Intenta con otro término de búsqueda
              </p>
            )}
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <Card key={user._id} className="hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                {/* Información del usuario */}
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <UserIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {user.name || 'Usuario sin nombre'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Cliente desde {formatRelativeTime(user.createdAt)}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.status === 'active' ? '✓ Activo' : '○ Inactivo'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        Teléfono
                      </p>
                      <p className="font-medium">{user.phone}</p>
                    </div>
                    {user.email && (
                      <div>
                        <p className="text-gray-500 flex items-center">
                          <Mail className="w-4 h-4 mr-1" />
                          Email
                        </p>
                        <p className="font-medium text-sm">{user.email}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-500">Reservas</p>
                      <p className="font-bold text-blue-600">{user.totalReservations || 0}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Total Gastado</p>
                      <p className="font-bold text-green-600">
                        {formatCurrency(user.totalSpent || 0)}
                      </p>
                    </div>
                  </div>

                  {/* Información adicional */}
                  <div className="mt-3 flex items-center space-x-4 text-xs text-gray-600">
                    <span>
                      📅 Primer contacto: {formatDateTime(user.firstContact)}
                    </span>
                    <span>
                      🕒 Último contacto: {formatRelativeTime(user.lastContact)}
                    </span>
                  </div>

                  {/* Preferencias */}
                  {user.preferences && (
                    <div className="mt-3 flex items-center space-x-2">
                      {user.preferences.packageType && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                          ❤️ Prefiere: {user.preferences.packageType}
                        </span>
                      )}
                      {user.preferences.roomType && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          🛏️ Prefiere: {user.preferences.roomType}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Acciones */}
                <div className="flex flex-col justify-center space-y-2 ml-4">
                  <Link href={`/users/${user.phone}`}>
                    <Button size="sm" variant="primary" className="w-full">
                      Ver perfil
                    </Button>
                  </Link>
                  <Link href={`/reservations?user=${user.phone}`}>
                    <Button size="sm" variant="outline" className="w-full">
                      Ver reservaciones
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Total */}
      {!loading && filteredUsers.length > 0 && (
        <div className="mt-6 text-center text-gray-600">
          {searchQuery ? (
            <>
              Mostrando <span className="font-semibold">{filteredUsers.length}</span> de{' '}
              <span className="font-semibold">{users.length}</span> usuarios
            </>
          ) : (
            <>
              Total: <span className="font-semibold">{users.length}</span> usuarios
            </>
          )}
        </div>
      )}
    </div>
  );
}

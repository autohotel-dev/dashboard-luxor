// app/settings/page.tsx - Configuración del dashboard
'use client';

import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import { 
  Sun, 
  Moon, 
  Monitor,
  Bell,
  BellOff,
  RefreshCw,
  Palette,
  Globe,
  Mail,
  Smartphone
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { theme, changeTheme } = useTheme();
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  const handleSaveSettings = () => {
    // Aquí guardarías en localStorage o API
    localStorage.setItem('settings', JSON.stringify({
      autoRefresh,
      emailNotifications,
      pushNotifications
    }));
    toast.success('Configuración guardada');
  };

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-600 mt-1">Personaliza tu experiencia en el dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Apariencia */}
        <Card title="🎨 Apariencia">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-3">Selecciona el tema de la interfaz</p>
              <div className="space-y-2">
                <button
                  onClick={() => changeTheme('light')}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                    theme === 'light' 
                      ? 'border-blue-600 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Sun className="w-5 h-5 text-yellow-600" />
                    <span className="font-medium text-gray-900">Modo Claro</span>
                  </div>
                  {theme === 'light' && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </button>

                <button
                  onClick={() => changeTheme('dark')}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                    theme === 'dark' 
                      ? 'border-blue-600 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Moon className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-900">Modo Oscuro</span>
                  </div>
                  {theme === 'dark' && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </button>

                <button
                  onClick={() => changeTheme('system')}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                    theme === 'system' 
                      ? 'border-blue-600 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Monitor className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Sistema</span>
                  </div>
                  {theme === 'system' && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Notificaciones */}
        <Card title="🔔 Notificaciones">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Email</p>
                  <p className="text-xs text-gray-500">Recibir notificaciones por correo</p>
                </div>
              </div>
              <button
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  emailNotifications ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Smartphone className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">Push</p>
                  <p className="text-xs text-gray-500">Notificaciones del navegador</p>
                </div>
              </div>
              <button
                onClick={() => setPushNotifications(!pushNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  pushNotifications ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    pushNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </Card>

        {/* Dashboard */}
        <Card title="📊 Dashboard">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <RefreshCw className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-medium text-gray-900">Auto-refresh</p>
                  <p className="text-xs text-gray-500">Actualizar métricas cada 30s</p>
                </div>
              </div>
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  autoRefresh ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    autoRefresh ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </Card>

        {/* Información */}
        <Card title="ℹ️ Información">
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Versión</p>
              <p className="font-medium text-gray-900">1.0.0</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Hotel</p>
              <p className="font-medium text-gray-900">Auto Hotel Luxor</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">API</p>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <p className="font-mono text-xs text-gray-700 break-all overflow-wrap-anywhere">
                  {process.env.NEXT_PUBLIC_API_URL || 'No configurada'}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Última actualización</p>
              <p className="font-medium text-gray-900">Noviembre 2025</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Acciones */}
      <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-500 text-center md:text-left">
          Los cambios se guardan automáticamente
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto"
          >
            Restablecer
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSaveSettings}
            className="w-full sm:w-auto"
          >
            Guardar Configuración
          </Button>
        </div>
      </div>

      {/* Ayuda */}
      <Card className="mt-6">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Globe className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">¿Necesitas ayuda?</h3>
            <p className="text-sm text-gray-600 mb-3">
              Si tienes problemas o sugerencias, contacta al equipo de soporte.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="sm" variant="outline" className="w-full sm:w-auto">
                Ver documentación
              </Button>
              <Button size="sm" variant="primary" className="w-full sm:w-auto">
                Contactar soporte
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

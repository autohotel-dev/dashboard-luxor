// utils.ts - Funciones utilitarias
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Formatear moneda
export function formatCurrency(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '$0.00';
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(amount);
}

// Formatear fecha
export function formatDate(date: string | Date | undefined | null, formatStr: string = 'PPP'): string {
  if (!date) return 'N/A';
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return 'Fecha inválida';
    return format(dateObj, formatStr, { locale: es });
  } catch (error) {
    return 'Fecha inválida';
  }
}

// Formatear fecha y hora
export function formatDateTime(date: string | Date | undefined | null): string {
  if (!date) return 'N/A';
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return 'Fecha inválida';
    return format(dateObj, 'PPP p', { locale: es });
  } catch (error) {
    return 'Fecha inválida';
  }
}

// Formatear hora relativa
export function formatRelativeTime(date: string | Date | undefined | null): string {
  if (!date) return 'N/A';
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return 'Fecha inválida';
    
    const now = new Date();
    const diff = now.getTime() - dateObj.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Justo ahora';
    if (minutes < 60) return `Hace ${minutes} min`;
    if (hours < 24) return `Hace ${hours} h`;
    if (days === 1) return 'Hace 1 día';
    return `Hace ${days} días`;
  } catch (error) {
    return 'Fecha inválida';
  }
}

// Obtener color por estado
export function getStatusColor(status: string | undefined | null): string {
  if (!status) return 'bg-gray-200 text-gray-900 border border-gray-300';
  const colors: Record<string, string> = {
    pending_payment: 'bg-yellow-100 text-yellow-900 border border-yellow-300',
    payment_received: 'bg-blue-100 text-blue-900 border border-blue-300',
    confirmed: 'bg-green-100 text-green-900 border border-green-300',
    cancelled: 'bg-red-100 text-red-900 border border-red-300',
    completed: 'bg-gray-200 text-gray-900 border border-gray-300'
  };
  return colors[status] || 'bg-gray-200 text-gray-900 border border-gray-300';
}

// Obtener texto por estado
export function getStatusText(status: string | undefined | null): string {
  if (!status) return 'Sin estado';
  const texts: Record<string, string> = {
    pending_payment: 'Pendiente de pago',
    payment_received: 'Pago recibido',
    confirmed: 'Confirmada',
    cancelled: 'Cancelada',
    completed: 'Completada'
  };
  return texts[status] || status;
}

// Obtener nombre de paquete
export function getPackageName(packageType: string | undefined | null): string {
  if (!packageType) return 'N/A';
  const names: Record<string, string> = {
    deseo: 'Paquete Deseo',
    enamorados: 'Paquete Enamorados',
    premium: 'Paquete Premium'
  };
  return names[packageType] || packageType;
}

// Obtener nombre de habitación
export function getRoomName(roomType: string | undefined | null): string {
  if (!roomType) return 'N/A';
  const names: Record<string, string> = {
    master_suite_sencilla: 'Master Suite Sencilla',
    master_suite_jacuzzi: 'Master Suite Jacuzzi',
    master_suite_sauna_jacuzzi: 'Master Suite Sauna + Jacuzzi',
    master_suite_alberca: 'Master Suite Alberca'
  };
  return names[roomType] || roomType;
}

// Truncar texto
export function truncate(text: string | undefined | null, maxLength: number = 50): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// Formatear número de teléfono
export function formatPhone(phone: string | undefined | null): string {
  if (!phone) return '';
  const cleaned = phone.replace(/^521/, '').replace(/^52/, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

// Calcular porcentaje
export function calculatePercentage(value: number | undefined | null, total: number | undefined | null): string {
  if (!value || !total || total === 0) return '0';
  return ((value / total) * 100).toFixed(1);
}

// Obtener iniciales de nombre
export function getInitials(name: string | undefined | null): string {
  if (!name) return '??';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

// Combinar clases CSS
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

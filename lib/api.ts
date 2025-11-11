// api.ts - Cliente Axios configurado con TypeScript
import axios, { AxiosInstance } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Crear instancia de Axios
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para requests
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para responses
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      console.error('Error de API:', error.response.data);
    } else if (error.request) {
      console.error('Error de red:', error.message);
    }
    return Promise.reject(error);
  }
);

// Types
export interface Reservation {
  _id: string;
  userPhone: string;
  packageType: string;
  roomType: string;
  date: string;
  checkInTime: string;
  numberOfGuests: number;
  customerName: string;
  customerEmail: string;
  specialRequests?: string;
  status: 'pending_payment' | 'payment_received' | 'confirmed' | 'cancelled' | 'completed';
  totalAmount: number;
  confirmationCode: string;
  paymentDeadline?: string;
  paidAt?: string;
  paymentProof?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardSummary {
  today: {
    reservations: number;
    newUsers: number;
    revenue: number;
  };
  week: {
    reservations: number;
    newUsers: number;
    revenue: number;
  };
  month: {
    reservations: number;
    newUsers: number;
    revenue: number;
  };
  topPackage: string;
  topRoom: string;
  conversionRate: number;
}

export interface RealtimeMetrics {
  messagesLast5Min: number;
  pendingReservations: number;
  systemStatus: string;
  dbConnected: boolean;
  uptime: number;
  timestamp: string;
}

export interface User {
  _id: string;
  phone: string;
  name?: string;
  email?: string;
  firstContact: string;
  lastContact: string;
  totalReservations: number;
  totalSpent: number;
  status: 'active' | 'inactive';
  preferences?: {
    packageType?: string;
    roomType?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  phone: string;
  from: string;
  to: string;
  body: string;
  timestamp: string;
  type: 'text' | 'image' | 'interactive' | 'button';
  direction: 'inbound' | 'outbound';
  status?: 'sent' | 'delivered' | 'read' | 'failed';
  metadata?: {
    mediaUrl?: string;
    caption?: string;
    fileName?: string;
    [key: string]: any;
  };
  createdAt: string;
}

// ============================================
// 🏨 RESERVAS
// ============================================

export const reservationsAPI = {
  getAll: (params = {}) => api.get('/reservations', { params }),
  getById: (id: string) => api.get(`/reservations/${id}`),
  getByUser: (phone: string) => api.get(`/reservations/user/${phone}`),
  updateStatus: (id: string, status: string) => api.put(`/reservations/${id}/status`, { status }),
  getStats: () => api.get('/reservations/stats')
};

// ============================================
// 👥 USUARIOS
// ============================================

export const usersAPI = {
  getAll: (params = {}) => api.get('/users', { params }),
  getByPhone: (phone: string) => api.get(`/users/${phone}`),
  getStats: () => api.get('/users/stats')
};

// ============================================
// 💬 MENSAJES
// ============================================

export const messagesAPI = {
  getByUser: (phone: string, limit = 100) => api.get(`/messages/user/${phone}`, { params: { limit } }),
  getStats: () => api.get('/messages/stats'),
  sendMessage: (phone: string, message: string) => api.post('/messages/send', { phone, message })
};

// ============================================
// 🔔 NOTIFICACIONES
// ============================================

export const notificationsAPI = {
  getAll: (params = {}) => api.get('/notifications', { params }),
  getUnread: () => api.get('/notifications/unread'),
  markAsRead: (id: string) => api.put(`/notifications/${id}/read`)
};

// ============================================
// 📊 DASHBOARD Y ANALYTICS
// ============================================

export const dashboardAPI = {
  getSummary: (): Promise<{ summary: DashboardSummary }> => api.get('/dashboard/summary'),
  getRealtime: (): Promise<{ realtime: RealtimeMetrics }> => api.get('/analytics/realtime')
};

// ============================================
// 🔍 BÚSQUEDA
// ============================================

export const searchAPI = {
  search: (query: string, type = 'all') => api.get('/search', { params: { q: query, type } })
};

export default api;

# 🏨 Auto Hotel Luxor - Dashboard

Dashboard administrativo para gestionar reservas, usuarios, mensajes y notificaciones del Auto Hotel Luxor.

## 🚀 Tecnologías

- **Next.js 16** - Framework React
- **Axios** - Cliente HTTP
- **Tailwind CSS** - Estilos
- **Lucide React** - Iconos
- **React Hot Toast** - Notificaciones
- **date-fns** - Manejo de fechas

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
# Crear archivo .env.local con:
NEXT_PUBLIC_API_URL=https://whatsapp-test-vha5.onrender.com/api

# Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
dashboard-luxor/
├── app/
│   ├── page.jsx                    # Dashboard principal
│   ├── reservations/               # Gestión de reservas
│   ├── notifications/              # Notificaciones
│   └── layout.tsx                  # Layout principal
├── components/
│   ├── Dashboard/                  # Componentes del dashboard
│   ├── Reservations/               # Componentes de reservas
│   ├── Layout/                     # Sidebar, Navbar
│   └── UI/                         # Componentes reutilizables
├── hooks/
│   ├── useDashboard.js            # Hook para dashboard
│   ├── useReservations.js         # Hook para reservas
│   └── useRealtime.js             # Hook para tiempo real
└── lib/
    ├── api.js                      # Cliente Axios
    └── utils.js                    # Utilidades
```

## 🎯 Funcionalidades

### ✅ Implementadas

- 📊 Dashboard con métricas en tiempo real
- 🏨 Gestión completa de reservas
  - Listar todas las reservas
  - Filtrar por estado
  - Ver detalles de reserva
  - Confirmar reservas
  - Cancelar reservas
- 🔔 Sistema de notificaciones
  - Ver notificaciones no leídas
  - Marcar como leídas
  - Filtrado de notificaciones
- 📱 Responsive design
- ⚡ Actualización automática de datos

### 🔄 Por Implementar

- 👥 Gestión de usuarios
- 💬 Vista de mensajes
- 🔍 Búsqueda global
- 📈 Gráficas de revenue
- 📥 Exportar reportes
- 🔐 Autenticación

## 🛠️ Comandos

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Iniciar servidor de producción
npm start

# Lint
npm run lint
```

## 📡 API

El dashboard consume la API del backend de WhatsApp Bot:

**Base URL:** `https://whatsapp-test-vha5.onrender.com/api`

### Endpoints principales:
- `GET /dashboard/summary` - Resumen del dashboard
- `GET /reservations` - Lista de reservas
- `GET /notifications/unread` - Notificaciones no leídas
- `PUT /reservations/:id/status` - Actualizar estado de reserva

Ver documentación completa en el proyecto backend.

## 🎨 Personalización

### Colores
Los colores se pueden personalizar en `tailwind.config.js` y `globals.css`.

### Componentes
Todos los componentes están en `/components` y son reutilizables.

## 🚀 Deploy

### Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Otras Opciones
- Netlify
- Railway
- AWS Amplify

## 📝 Notas

- Asegúrate de que el backend esté corriendo antes de usar el dashboard
- La API debe tener CORS habilitado para el dominio del dashboard
- Las notificaciones en tiempo real se actualizan cada 30 segundos

## 👨‍💻 Desarrollo

Este proyecto fue creado para el Auto Hotel Luxor como parte del sistema integral de gestión de reservas via WhatsApp.

**Backend:** [whatsapp-test](https://github.com/...)  
**API Docs:** Ver `API_ENDPOINTS.md` en el proyecto backend

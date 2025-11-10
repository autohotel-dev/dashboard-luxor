# 🚀 Quick Start - Dashboard Luxor

## ✅ Paso 1: Verificar que todo está instalado

Ya debes tener:
- ✅ Node.js instalado
- ✅ Proyecto Next.js creado
- ✅ Dependencias instaladas (`npm install`)
- ✅ Archivo `.env.local` creado

## 🔧 Paso 2: Iniciar el servidor

```bash
cd dashboard-luxor
npm run dev
```

El dashboard estará disponible en: **http://localhost:3000**

## 📊 Paso 3: Explorar el Dashboard

### Páginas disponibles:

1. **Dashboard Principal** - http://localhost:3000
   - Métricas de hoy, semana y mes
   - Paquetes y habitaciones más populares
   - Tasa de conversión
   - Métricas en tiempo real

2. **Reservas** - http://localhost:3000/reservations
   - Lista de todas las reservas
   - Filtrar por estado
   - Confirmar o cancelar reservas
   - Ver detalles de cada reserva

3. **Notificaciones** - http://localhost:3000/notifications
   - Ver notificaciones no leídas
   - Marcar como leídas
   - Filtrar por tipo

## 🎯 Funcionalidades Clave

### Gestionar Reservas

1. Ir a `/reservations`
2. Filtrar por estado: `pending_payment`, `payment_received`, `confirmed`
3. Click en "Ver detalle" para ver más información
4. Confirmar reservas con estado `payment_received`
5. Cancelar reservas si es necesario

### Ver Métricas en Tiempo Real

- El dashboard se actualiza automáticamente cada 30 segundos
- Puedes ver:
  - Mensajes recibidos en los últimos 5 minutos
  - Reservas pendientes de pago
  - Estado del sistema
  - Conexión a la base de datos

## 🔍 Troubleshooting

### Error: Cannot connect to API

**Problema:** El dashboard no puede conectarse al backend

**Solución:**
1. Verifica que el archivo `.env.local` existe
2. Verifica que la URL es correcta:
   ```
   NEXT_PUBLIC_API_URL=https://whatsapp-test-vha5.onrender.com/api
   ```
3. Verifica que el backend está corriendo
4. Reinicia el servidor: `Ctrl+C` y luego `npm run dev`

### Error: Module not found

**Problema:** Falta alguna dependencia

**Solución:**
```bash
npm install
```

### Página en blanco

**Problema:** No hay datos en la API

**Solución:**
1. Verifica que tienes reservas en el sistema
2. Abre la consola del navegador (F12) para ver errores
3. Verifica que el backend responde correctamente

## 📝 Próximos Pasos

### Páginas por implementar:

1. **Usuarios** (`/users`)
   - Lista de todos los usuarios
   - Ver perfil de usuario
   - Historial de reservas por usuario

2. **Mensajes** (`/messages`)
   - Conversaciones con clientes
   - Búsqueda de mensajes
   - Estadísticas de mensajes

3. **Búsqueda** (`/search`)
   - Búsqueda global
   - Filtros avanzados

4. **Gráficas** (`/analytics`)
   - Revenue charts
   - Ocupación por mes
   - Tendencias

## 🎨 Personalización

### Cambiar colores

Edita `app/globals.css` y modifica las variables CSS.

### Agregar nueva página

1. Crear carpeta en `app/nombre-pagina/`
2. Crear archivo `page.jsx` dentro
3. Agregar ruta al Sidebar en `components/Layout/Sidebar.jsx`

### Crear nuevo componente

1. Crear archivo en `components/Categoria/NombreComponente.jsx`
2. Importar donde lo necesites

## 🚀 Deploy a Producción

### Vercel (Más fácil)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```

Sigue las instrucciones en pantalla.

### Netlify

```bash
# Build
npm run build

# El build está en la carpeta .next
```

Sube la carpeta al panel de Netlify.

## 📞 Soporte

Si tienes problemas:
1. Revisa la consola del navegador (F12)
2. Revisa los logs del servidor
3. Verifica que el backend responde correctamente

## ✅ Checklist de Inicio

- [ ] Servidor corriendo en http://localhost:3000
- [ ] Dashboard principal carga correctamente
- [ ] Puedes ver las reservas en `/reservations`
- [ ] Las notificaciones funcionan en `/notifications`
- [ ] Los datos se actualizan automáticamente

**¡Listo! Ya puedes empezar a usar el dashboard.** 🎉

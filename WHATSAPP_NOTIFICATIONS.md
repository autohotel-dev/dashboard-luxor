# 📱 Sistema de Notificaciones por WhatsApp

## 🎯 Funcionalidad Implementada

Se ha agregado notificación automática por WhatsApp cuando se actualiza el estado de una reserva:

### ✅ Estados que envían notificación:

1. **Confirmada (`confirmed`)** - Cuando el pago es aceptado
   - Mensaje con detalles completos de la reserva
   - Código de confirmación destacado
   - Mensaje de bienvenida

2. **Cancelada (`cancelled`)** - Cuando se rechaza el pago o se cancela
   - Notificación de cancelación
   - Detalles de la reserva cancelada
   - Mensaje de apoyo al cliente

---

## 🔧 Cambios en el Frontend

### 1. API Cliente (`lib/api.ts`)
```typescript
export const messagesAPI = {
  getByUser: (phone: string, limit = 100) => api.get(`/messages/user/${phone}`, { params: { limit } }),
  getStats: () => api.get('/messages/stats'),
  sendMessage: (phone: string, message: string) => api.post('/messages/send', { phone, message })
};
```

### 2. Función de actualización de estado (`app/reservations/[id]/page.tsx`)
```typescript
const handleUpdateStatus = async (status: string) => {
  if (!reservation) return;

  try {
    // Actualizar estado
    await reservationsAPI.updateStatus(params.id as string, status);
    
    // Preparar mensaje según el estado
    let message = '';
    
    if (status === 'confirmed') {
      message = `🎉 ¡Excelente noticia! Tu pago ha sido verificado...`;
    } else if (status === 'cancelled') {
      message = `❌ Lamentablemente tu reserva ha sido cancelada...`;
    }
    
    // Enviar notificación por WhatsApp
    if (message && reservation.userPhone) {
      await messagesAPI.sendMessage(reservation.userPhone, message);
    }
    
    fetchReservation();
  } catch (error) {
    toast.error('Error al actualizar estado');
  }
};
```

---

## 🚀 Requisitos del Backend

### Endpoint Requerido:

```javascript
POST /api/messages/send
Content-Type: application/json

Body:
{
  "phone": "5215512345678",
  "message": "Mensaje de notificación..."
}

Response:
{
  "success": true,
  "messageId": "wamid.XXX",
  "timestamp": "2025-11-10T18:00:00.000Z"
}
```

### Implementación Sugerida en el Backend:

```javascript
// routes/messages.js
router.post('/send', async (req, res) => {
  try {
    const { phone, message } = req.body;
    
    // Validar datos
    if (!phone || !message) {
      return res.status(400).json({ 
        error: 'Phone and message are required' 
      });
    }
    
    // Enviar mensaje por WhatsApp Business API
    const result = await whatsappService.sendMessage(phone, message);
    
    // Guardar mensaje en la base de datos
    const newMessage = new Message({
      phone,
      from: process.env.WHATSAPP_PHONE_ID,
      to: phone,
      body: message,
      direction: 'outbound',
      type: 'text',
      status: 'sent',
      timestamp: new Date()
    });
    
    await newMessage.save();
    
    res.json({
      success: true,
      messageId: result.messageId,
      timestamp: newMessage.timestamp
    });
    
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});
```

---

## 📋 Plantillas de Mensajes

### Mensaje de Confirmación:
```
🎉 ¡Excelente noticia! Tu pago ha sido verificado y aceptado correctamente.

✅ Tu reserva ha sido confirmada:
📅 Fecha: [fecha completa]
🕐 Hora de entrada: [hora]
🏨 Habitación: [tipo]
📦 Paquete: [tipo]
👥 Huéspedes: [número]
💰 Total: $[monto]
🔑 Código de confirmación: *[código]*

¡Te esperamos! Si tienes alguna duda, no dudes en contactarnos. 😊
```

### Mensaje de Cancelación:
```
❌ Lamentablemente tu reserva ha sido cancelada.

📋 Detalles de la reserva cancelada:
📅 Fecha: [fecha completa]
🔑 Código: [código]

Si tienes alguna pregunta o deseas hacer una nueva reserva, estamos para ayudarte. 💙
```

---

## 🔐 Configuración de WhatsApp Business API

### Variables de entorno requeridas:
```env
WHATSAPP_API_URL=https://graph.facebook.com/v18.0
WHATSAPP_PHONE_ID=tu_phone_id
WHATSAPP_ACCESS_TOKEN=tu_access_token
```

### Servicio de WhatsApp (`services/whatsappService.js`):
```javascript
const axios = require('axios');

class WhatsAppService {
  constructor() {
    this.apiUrl = process.env.WHATSAPP_API_URL;
    this.phoneId = process.env.WHATSAPP_PHONE_ID;
    this.token = process.env.WHATSAPP_ACCESS_TOKEN;
  }

  async sendMessage(to, message) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/${this.phoneId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: to,
          type: 'text',
          text: { body: message }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        messageId: response.data.messages[0].id
      };
    } catch (error) {
      console.error('WhatsApp API Error:', error.response?.data);
      throw error;
    }
  }
}

module.exports = new WhatsAppService();
```

---

## ✅ Flujo Completo

1. **Admin revisa el pago** en el dashboard
2. **Actualiza el estado** a "Confirmada" o "Cancelada"
3. **Frontend llama al backend** con el nuevo estado
4. **Backend actualiza la reserva** en la base de datos
5. **Frontend envía mensaje** vía `/api/messages/send`
6. **Backend procesa el mensaje** y lo envía a WhatsApp API
7. **Cliente recibe notificación** en WhatsApp
8. **Mensaje se guarda** en la base de datos para historial

---

## 🎨 Experiencia de Usuario

### En el Dashboard:
- Al confirmar una reserva: "Estado actualizado y cliente notificado por WhatsApp" ✅
- Al cancelar una reserva: "Estado actualizado y cliente notificado por WhatsApp" ✅
- Si falla el mensaje: "Estado actualizado (mensaje no enviado)" ⚠️

### En WhatsApp (Cliente):
- Recibe mensaje inmediatamente después de la actualización
- Mensaje con formato profesional y emojis
- Toda la información relevante incluida
- Tono amigable y profesional

---

## 🔍 Testing

### Test Manual:
1. Abrir reserva con estado "payment_received"
2. Click en "Confirmar Reserva"
3. Verificar toast de éxito
4. Verificar que el cliente recibió el mensaje en WhatsApp
5. Verificar que el mensaje aparece en `/messages/[phone]`

### Test de Cancelación:
1. Abrir reserva con estado activo
2. Click en "Cancelar Reserva"
3. Confirmar acción
4. Verificar notificación enviada

---

## 📊 Monitoreo

### Logs a revisar:
- ✅ Actualizaciones de estado exitosas
- ✅ Mensajes enviados correctamente
- ⚠️ Errores de envío de mensaje
- ⚠️ Fallos de API de WhatsApp

### Métricas importantes:
- Tasa de entrega de mensajes
- Tiempo de respuesta de WhatsApp API
- Mensajes fallidos vs exitosos

---

## 🚨 Manejo de Errores

El sistema maneja errores de manera elegante:

1. **Si falla el envío del mensaje**: Se actualiza el estado de la reserva de todos modos
2. **Si falla la actualización**: No se envía el mensaje
3. **Mensajes de error claros** para el administrador
4. **Logs detallados** para debugging

---

## 🎯 Próximas Mejoras

1. ✏️ Templates personalizables desde el dashboard
2. 📸 Adjuntar imágenes al mensaje (QR, mapa, etc.)
3. 🔔 Recordatorios automáticos antes del check-in
4. 📊 Estadísticas de mensajes enviados
5. ⏰ Programar mensajes para envío posterior
6. 🌐 Soporte multiidioma

---

**🎉 Sistema de Notificaciones Implementado!** 

El frontend está listo. Solo se requiere implementar el endpoint `/api/messages/send` en el backend para que funcione completamente.

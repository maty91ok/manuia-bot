const venom = require('venom-bot');
const axios = require('axios');

venom
  .create({
    session: 'manuia-session',
    multidevice: true,
  })
  .then((client) => start(client))
  .catch((err) => console.log('❌ Error creando sesión:', err));

function start(client) {
  console.log('🟢 MANUIA conectado. Esperando mensajes...');

  client.onMessage(async (message) => {
    if (message.body && message.isGroupMsg === false) {
      console.log('📩 Mensaje recibido:', message.body);

      try {
        const respuesta = await axios.post('https://mente.pyme.app.n8n.cloud/webhook-test/manuia-mensaje', {
          numero: message.from,
          mensaje: message.body,
        });

        const texto = respuesta.data.respuesta || '🧠 Estoy procesando tu mensaje...';
        await client.sendText(message.from, texto);
      } catch (error) {
        console.error('❌ Error al consultar n8n:', error.message);
        client.sendText(message.from, '⚠️ Lo siento, hubo un error. Intentá más tarde.');
      }
    }
  });
}


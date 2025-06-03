const venom = require('venom-bot');
const axios = require('axios');

process.env.CHROME_BIN = process.env.CHROME_BIN || "/usr/bin/google-chrome";

venom
  .create()
  .then((client) => start(client))
  .catch((err) => console.log("Error creando sesión:", err));

function start(client) {
  console.log("🟢 Bot iniciado correctamente. Esperando mensajes...");

  client.onMessage(async (message) => {
    if (message.body && message.isGroupMsg === false) {
      console.log("📩 Mensaje recibido:", message.body);

      try {
        const respuesta = await axios.post('https://mente.pyme.app.n8n.cloud/webhook/manuia-mensaje', {
          numero: message.from,
          mensaje: message.body
        });

        const texto = respuesta.data.respuesta || "🧠 Procesando tu mensaje...";
        await client.sendText(message.from, texto);
      } catch (error) {
        console.error("❌ Error al conectar con n8n:", error.message);
        client.sendText(message.from, "Hubo un error al responder. Intenta más tarde.");
      }
    }
  });
}

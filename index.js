const express = require('express');
const { create } = require('venom-bot');

const app = express();
app.use(express.json());

let clientInstance; // Guardar la instancia del cliente

async function initializeBot() {
  if (!clientInstance) {
    console.log('Inicializando Venom-bot...');
    clientInstance = await create({
      session: 'my-session', // Nombre de la sesión
    });
    console.log('Bot iniciado correctamente. Escanea el código QR en la terminal.');

    clientInstance.onMessage(async (message) => {
      console.log('Mensaje recibido:', message.body);
      if (message.body.toLowerCase() === 'hola') {
        await clientInstance.sendText(message.from, '¡Hola desde Venom!');
      }
    });
  }
}

// Inicializa el bot
initializeBot().catch((error) => {
  console.error('Error al inicializar el bot:', error);
});

// Rutas API
app.get('/', (req, res) => {
  res.status(200).json({ status: 'Bot is running!' });
});

app.post('/send-message', async (req, res) => {
  const { message } = req.body;

  if (!clientInstance) {
    return res.status(500).json({ error: 'Bot no inicializado.' });
  }

  try {
    // Ejemplo: Enviar mensaje
    await clientInstance.sendText(message.to, message.body);
    return res.status(200).json({ status: 'Mensaje enviado correctamente.' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Define el puerto y pon el servidor en escucha
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});

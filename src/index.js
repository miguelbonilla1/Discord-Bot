// import { Client, GatewayIntentBits } from "discord.js";
// import { handleCryptoCommand } from './commands/crypto.js';
// import express from 'express';
// import path from 'path';  // Para manejar las rutas
// import dotenv from 'dotenv';
// dotenv.config();



// const client = new Client({
//   intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
// });

// client.once('ready', () => {
//   console.log('Bot is online!');
// });

// client.on('messageCreate', async (message) => {
//   if (message.author.bot) return;
//   if (message.content.startsWith('!crypto')) {
//     await handleCryptoCommand(message);
//   }
// });

// client.login(process.env.DISCORD_TOKEN);


// const app = express();


// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




import { Client, GatewayIntentBits } from "discord.js";
import { handleCryptoCommand } from './commands/crypto.js';
import express from 'express';
import path from 'path';  // Para manejar las rutas
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

// Evento cuando el bot está listo y conectado
client.once('ready', () => {
  console.log('Bot is online!');
});

// Evento para manejar cuando se crea un mensaje
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith('!crypto')) {
    await handleCryptoCommand(message);
  }
});

// Evento para manejar reconexiones automáticas
client.on('reconnecting', () => {
  console.log('Bot is reconnecting to Discord...');
});

// Evento para manejar desconexiones
client.on('disconnect', (event) => {
  console.log(`Bot disconnected with code ${event.code}. Attempting to reconnect...`);
  client.login(process.env.DISCORD_TOKEN);  // Reintentar iniciar sesión en caso de desconexión
});

// Evento para manejar errores
client.on('error', (error) => {
  console.error('An error occurred:', error);
});

// Iniciar sesión en Discord
client.login(process.env.DISCORD_TOKEN);

// Configuración del servidor Express
const app = express();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

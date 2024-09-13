// // import { Client, GatewayIntentBits } from "discord.js";
// // import { handleCryptoCommand } from './commands/crypto.js';
// // import express from 'express';
// // import path from 'path';  // Para manejar las rutas
// // import dotenv from 'dotenv';
// // dotenv.config();



// // const client = new Client({
// //   intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
// // });

// // client.once('ready', () => {
// //   console.log('Bot is online!');
// // });

// // client.on('messageCreate', async (message) => {
// //   if (message.author.bot) return;
// //   if (message.content.startsWith('!crypto')) {
// //     await handleCryptoCommand(message);
// //   }
// // });

// // client.login(process.env.DISCORD_TOKEN);


// // const app = express();


// // const PORT = process.env.PORT || 5000;
// // app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




// import { Client, GatewayIntentBits } from "discord.js";
// import { handleCryptoCommand } from './commands/crypto.js';
// import express from 'express';
// import path from 'path';  // Para manejar las rutas
// import dotenv from 'dotenv';
// dotenv.config();

// const client = new Client({
//   intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
// });

// // Evento cuando el bot está listo y conectado
// client.once('ready', () => {
//   console.log('Bot is online!');
// });

// // Evento para manejar cuando se crea un mensaje
// client.on('messageCreate', async (message) => {
//   if (message.author.bot) return;
//   if (message.content.startsWith('!crypto')) {
//     await handleCryptoCommand(message);
//   }
// });

// // Evento para manejar reconexiones automáticas
// client.on('reconnecting', () => {
//   console.log('Bot is reconnecting to Discord...');
// });

// // Evento para manejar desconexiones
// client.on('disconnect', (event) => {
//   console.log(`Bot disconnected with code ${event.code}. Attempting to reconnect...`);
//   client.login(process.env.DISCORD_TOKEN);  // Reintentar iniciar sesión en caso de desconexión
// });

// // Evento para manejar errores
// client.on('error', (error) => {
//   console.error('An error occurred:', error);
// });

// // Iniciar sesión en Discord
// client.login(process.env.DISCORD_TOKEN);

// // Configuración del servidor Express
// const app = express();
// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));





import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { handleCryptoCommand } from './commands/crypto.js';
import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import path from 'path';
import { fileURLToPath } from 'url';

// Cargar las variables de entorno
dotenv.config();

// Crear cliente de Discord
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

// Crear una colección para los slash commands
client.slashCommands = new Collection();

// Obtener la ruta actual del archivo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Leer los archivos en la carpeta slashCommands
const commandFiles = fs.readdirSync(path.join(__dirname, './slashCommands')).filter(file => file.endsWith('.js'));

// Cargar todos los slash commands dinámicamente
for (const file of commandFiles) {
  const command = await import(`./slashCommands/${file}`);
  client.slashCommands.set(command.data.name, command);
}

// Registro de comandos para cada nuevo servidor al que el bot sea invitado
const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

client.on('guildCreate', async guild => {
  console.log(`Bot agregado al servidor: ${guild.name} (ID: ${guild.id})`);

  const commands = client.slashCommands.map(command => command.data.toJSON());

  try {
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, guild.id),
      { body: commands },
    );
    console.log(`Comandos registrados para el servidor ${guild.name}`);
  } catch (error) {
    console.error(`Error al registrar comandos en el servidor ${guild.name}:`, error);
  }
});

// Evento cuando el bot está listo y conectado
client.once('ready', () => {
  console.log('Bot is online!');
});

// Evento para manejar slash commands
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.slashCommands.get(interaction.commandName);
  
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error('Error al ejecutar comando:', error);
    await interaction.reply({ content: 'Ocurrió un error al ejecutar el comando.', ephemeral: true });
  }
});

// Evento para manejar mensajes clásicos
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
  client.login(process.env.DISCORD_TOKEN);
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

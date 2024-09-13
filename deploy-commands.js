import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import fs from 'fs';
import dotenv from 'dotenv';

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Variables necesarias
const clientId = process.env.CLIENT_ID;
const token = process.env.DISCORD_TOKEN;
const guildId = process.env.GUILD_ID; // Esto es opcional para probar en un servidor específico

// Crear array de comandos
const commands = [];

// Leer los archivos de comandos desde la carpeta slashCommands
const commandFiles = fs.readdirSync('./src/slashCommands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = await import(`./src/slashCommands/${file}`);
  commands.push(command.data.toJSON());
}

// Crear una instancia de REST para registrar los comandos
const rest = new REST({ version: '9' }).setToken(token);

(async () => {
  try {
    console.log('Empezando a registrar slash commands.');

    // Si se proporciona un guildId, registrar los comandos en el servidor específico
    if (guildId) {
      await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commands },
      );
      console.log('Comandos registrados en el servidor especificado.');
    } else {
      // Si no hay guildId, registrar globalmente
      await rest.put(
        Routes.applicationCommands(clientId),
        { body: commands },
      );
      console.log('Comandos registrados globalmente.');
    }
  } catch (error) {
    console.error(error);
  }
})();

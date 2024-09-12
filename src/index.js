import { Client, GatewayIntentBits } from "discord.js";
import { handleCryptoCommand } from './commands/crypto.js';
import express from 'express';
import path from 'path';  // Para manejar las rutas
import dotenv from 'dotenv';
dotenv.config();



const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.once('ready', () => {
  console.log('Bot is online!');
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith('!crypto')) {
    await handleCryptoCommand(message);
  }
});

client.login(process.env.DISCORD_TOKEN);


const app = express();


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

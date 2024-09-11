import { Client, GatewayIntentBits } from "discord.js";
import { handleCryptoCommand } from './commands/crypto.js';
import dotenv from 'dotenv';
dotenv.config();

console.log('Clave de API de CoinMarketCap:', process.env.COINMARKETCAP_API_KEY); // Para verificar que la clave esté cargada correctamente

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

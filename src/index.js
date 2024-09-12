import { Client, GatewayIntentBits } from "discord.js";
import { handleCryptoCommand } from './commands/crypto.js';
import express from 'express';
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





// Ruta para el envío de correos
app.post('/send-email', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await sendMail({ name, email, message });
    res.status(200).send({ success: true });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
});

// Para cualquier otra ruta, servir el archivo index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

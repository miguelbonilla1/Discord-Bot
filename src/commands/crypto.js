// src/commands/crypto.js
import { getCryptoPrice } from '../utils/api.js';

export const handleCryptoCommand = async (message) => {
  const args = message.content.trim().split(/\s+/);
  const symbol = args[1]?.toUpperCase(); // Convertimos el símbolo a mayúsculas

  if (!symbol) {
    message.channel.send('Por favor, proporciona el símbolo de una criptomoneda. Ejemplo: `!crypto BTC`');
    return;
  }

  const price = await getCryptoPrice(symbol);
  if (price) {
    message.channel.send(`${symbol}: $${price.toFixed(2)}`);
  } else {
    message.channel.send('No se pudo obtener la información de la criptomoneda. Verifica el símbolo e inténtalo de nuevo.');
  }
};

import { SlashCommandBuilder } from '@discordjs/builders';
import { getCryptoPrice } from '../utils/api.js';

export const data = new SlashCommandBuilder()
  .setName('crypto')
  .setDescription('Obtén el precio de una criptomoneda')
  .addStringOption(option => 
    option.setName('symbol')
      .setDescription('Símbolo de la criptomoneda')
      .setRequired(true)
  );

export async function execute(interaction) {
  const symbol = interaction.options.getString('symbol').toUpperCase();
  const price = await getCryptoPrice(symbol);

  if (price) {
    await interaction.reply(`${symbol}: $${price.toFixed(2)}`);
  } else {
    await interaction.reply('No se pudo obtener el precio de la criptomoneda. Verifica el símbolo.');
  }
}

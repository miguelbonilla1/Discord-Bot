import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const COINMARKETCAP_API_URL = 'https://pro-api.coinmarketcap.com/v1';
const API_KEY = process.env.COINMARKETCAP_API_KEY;

console.log('Clave de API de CoinMarketCap:', API_KEY); // ¡Solo para depuración!

export const getCryptoPrice = async (symbol) => {
  if (!API_KEY) {
    console.error('La clave de la API de CoinMarketCap no está definida.');
    return null;
  }

  try {
    const response = await axios.get(`${COINMARKETCAP_API_URL}/cryptocurrency/quotes/latest`, {
      params: {
        symbol: symbol.toUpperCase(),
        convert: 'USD',
      },
      headers: {
        'X-CMC_PRO_API_KEY': API_KEY,
      },
    });

    const data = response.data.data[symbol.toUpperCase()];
    return data ? data.quote.USD.price : null;
  } catch (error) {
    console.error('Error fetching crypto price:', error);
    return null;
  }
};

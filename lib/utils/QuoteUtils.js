const fetch = require('cross-fetch');

const api_url = 'https://zenquotes.io/api/random/[quotes]';
const url = 'https://dad-jokes.p.rapidapi.com/random/joke';

const getQuote = async () => {
  const response = await fetch(api_url);
  const data = await response.json();

  return data;
};

const getDadJoke = async () => {
  try {
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Host': 'dad-jokes.p.rapidapi.com',
        'X-RapidAPI-Key': '3d25c58d9dmsh6460ed3cdd83970p1660b9jsnc25b01f6391f'
      }
    };

    const response = await fetch(url, options);
    const data = await response.json();
    console.log('Dad joke', data);
    return data;

  } catch (error) {
    console.error(error);
  }
};

module.exports = { getQuote, getDadJoke };

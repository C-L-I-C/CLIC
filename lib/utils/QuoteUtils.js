const fetch = require('cross-fetch');

const api_url = 'https://zenquotes.io/api/random/[quotes]'

const getQuote = async () => {
  const response = await fetch(api_url);
  const data = await response.json();

  return data
};

module.exports = getQuote;

const fetch = require('cross-fetch');

const getQuote = async (data) => {
  const res = await fetch('https://futuramaapi.herokuapp.com/api/quotes/1', {
    quote: data[0].quote
  }

  )
  return res.json();
};

module.exports = { getQuote };

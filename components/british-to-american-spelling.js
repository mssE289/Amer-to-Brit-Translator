const americanToBritishSpelling = require('./american-to-british-spelling.js');

const britishToAmericanSpelling = {};
for (const [american, british] of Object.entries(americanToBritishSpelling)) {
  britishToAmericanSpelling[british] = american;
}

module.exports = britishToAmericanSpelling;
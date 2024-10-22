const fs = require('fs');
const path = require('path');

const cardsDir = path.join(__dirname, '../public/cards');

fs.readdir(cardsDir, (err, files) => {
  if (err) {
    console.error('Unable to read cards directory:', err);
    return;
  }
  console.log(files.length);
});
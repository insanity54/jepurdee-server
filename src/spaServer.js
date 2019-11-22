const path = require('path');

const main = (app, express) => {
  app.use(express.static('jepurdee/dist'));

  app.all('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'jepurdee/dist/index.html'));
  });
}

module.exports = main;
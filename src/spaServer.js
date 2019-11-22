const path = require('path');
const jepurdeeDistFolder = path.resolve('../node_modules/jepurdee/dist/');

const main = (app, express) => {
  app.use(express.static(jepurdeeDistFolder));

  app.all('*', (req, res) => {
    res.sendFile(path.resolve(jepurdeeDistFolder, 'index.html'));
  });
}

module.exports = main;

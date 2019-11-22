const path = require('path');
const jepurdeeDistFolder = path.join(__dirname, '../node_modules/jepurdee/dist/');

const main = (app, express) => {
  app.use(express.static(jepurdeeDistFolder));

  app.all('*', (req, res) => {
    res.sendFile(path.resolve(path.join(jepurdeeDistFolder, 'index.html')));
  });
}

module.exports = main;

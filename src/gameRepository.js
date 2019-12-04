
JSZip = require('jszip');

const main = (app, express) => {
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  // app.use(express.static('data/repository'));

  /**
   * Upload a game file to the server.
   */
  app.post('/api/v1/game/upload', (req, res) => {
    // receive file
    // verify file is a game file
    // store game file using gameId as unique id
    let file = req.body;
    // unzip
    console.log(file);
    JSZip.loadAsync(file).then((zip) => {
      }).then((data) => {
        console.log(data)
        res.send('creat');
      }).catch((e) => {
        console.log(`holy shit we got an error`)
        console.error(e);
      });
  });

  app.get('/api/v1/game/:gameId', (req, res) => {
    // retrieve game json

  });

  app.post('/api/v1/game/update', (req, res) => {

  });

  app.get('/api/v1/test', (req, res) => {
    res.json({ msg: 'it works!' });
  });
}

module.exports = main;

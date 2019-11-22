const main = (app, express) => {
  app.use(express.static('data/games'));

  /**
   * Upload a game file to the server.
   */
  app.post('/api/v1/game/upload', (req, res) => {
    // receive file
    // verify file is a game file
    // store game file using gameId as unique id
    let game = req.body;
    console.log(game);
  });

  app.get('/api/v1/game/:gameId', (req, res) => {
    // retrieve game json

  });

  app.get('/api/v1/test', (req, res) => {
    res.json({ msg: 'it works!' });
  });
}

module.exports = main;

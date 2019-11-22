const main = (app, express) => {
  app.use(express.static('jepurdee'));
  app.use(express.static('games'));

  /**
   * Upload a game file to the server.
   */
  app.post('/api/v1/game/upload', (req, res) => {
    // receive file
    // verify file is a game file
    // store game file using gameId as unique id
  })

  app.get('/api/v1/game/:gameId', (req, res) => {
    // retrieve game json
  });
}

module.exports = main;

const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const JSZip = require('jszip');
const repoDir = path.join(__dirname, '..', 'data', 'repository');

isGuid = (id) => {
  return /(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}/.test(id);
}

const main = (app, express) => {
  app.use(express.urlencoded({
    extended: true
  }));
  app.use(express.json());
  // app.use(express.static('data/repository'));

  /**
   * Upload a game file to the server.
   */
  app.post('/api/v1/game/upload', (req, res) => {
    // receive file
    // verify file is a game file
    // store game file using gameId as unique id
    let zipContent = req.body.payload;

    // unzip
    JSZip.loadAsync(zipContent, {
        base64: true
      })
      .then((data) => {
        // console.log(data);
        let matches = data
          .filter((file, data) => {
            // find the main json file which contains the game's id.
            // this json file will be in the root directory,
            // NOT under the assets/ directory.
            return (!/assets\//.test(file))
          });

        let gameFiles = data.filter((file, data) => {
          return (!data.dir)
        });


        let idPromise = new Promise((resolve, reject) => {
          matches[0].async('text').then((t) => {
            return JSON.parse(t).id;
          }).then((id) => {
            if (typeof id === 'undefined') {
              reject('A game ID was not found in the game data!');
            } else {
              if (!isGuid(id)) reject('Game id was not a valid guid format')
              resolve(id);
            }
          });
        });


        idPromise.then((id) => {
            return fsp.mkdir(path.join(repoDir, id, 'raw', 'assets'), {
              recursive: true
            }).then(() => {
              data.generateNodeStream().pipe(fs.createWriteStream(path.join(repoDir, id, `${id}.zip`)));
              gameFiles.forEach((file) => {
                // write each file to disk
                file
                  .nodeStream()
                  .pipe(fs.createWriteStream(path.join(repoDir, id, 'raw', file.name)))
              })
            });
          })
          .then((id) => {
            console.log('sendin')
            res.json({
              msg: `game uploaded successfully with id ${id}`
            });
          })
          .catch((e) => {
            if (typeof e.code !== 'undefined') {
              if (e.code === 'EEXIST') {
                return res
                  .status(400)
                  .json({
                    msg: 'A game with this id already exists.'
                  })
              }
            }
            console.log('catchin')
            return res.status(400).json({
              msg: e
            });
          })
      }).catch((e) => {
        console.log(`holy shit we got an error`);
        console.error(e);
      });
  });

  app.get('/api/v1/game/:gameId', (req, res) => {
    // retrieve game json
    let gameId = req.params.gameId;
    if (typeof gameId === 'undefined')
      return res.send(400).json({
        msg: 'a gameId was not sent. gameId parameter is required!'
      });

    fsp.readFile(
      path.join(repoDir, gameId, 'raw', `${gameId}.json`),
      { encoding: 'utf-8' }
    ).then((file) => {
      res.json(file);
    });
  });

  app.get('/api/v1/game/:gameId/asset/:assetId', (req, res) => {
    // retrieve game json
    let { gameId, assetId } = req.params;
    if (typeof gameId === 'undefined')
      return res.send(400).json({
        msg: 'a gameId was not sent. gameId parameter is required!'
      });
    if (typeof assetId === 'undefined')
      return res.send(400).json({
        msg: 'a assetId was not sent. assetId parameter is required!'
      });

    res.sendFile(path.join(repoDir, gameId, 'raw', 'assets', `${assetId}`));

  });

  app.post('/api/v1/game/update', (req, res) => {

  });

  app.get('/api/v1/test', (req, res) => {
    res.json({
      msg: 'it works!'
    });
  });
}

module.exports = main;

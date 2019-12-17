const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const JSZip = require('jszip');
const repoDir = path.join(__dirname, '..', 'data', 'repository');
const Promise = require('bluebird');

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



    // we have a zip file, and we want to end up with...
    // * zip saved on disk as `${gameId}.zip`
    // * success message (can be blank)
    // * error message (can be blank)

    let payload = {
      zipContent: zipContent,
      zipData: null,
      manifestStr: null,
      manifestJson: null,
      id: null,
    };




    // process
    // * unzip the zip (compressed b64 data => zip object)
    // * validate the zip (zip object => true or false)
    //   * manifest should exist (zip object => true or false)
    //   * assets dir should exist (zip object => true or false)
    // * read the zip id (zip object => {String} id)
    //   * parse manifest and get .id
    // * store the zip on disk (zip object => promise)
    //

    let resError = (error) => {
      return res.status(400).json({
        msg: `${error}`
      });
    };

    let resSuccess = (payload) => {
      let {
        id
      } = payload;
      return res.json({
        msg: `game uploaded successfully with id ${id}`
      });
    };


    let unzip = (payload) => {
      console.log('  > unzipping');
      let {
        zipContent
      } = payload;
      return JSZip.loadAsync(zipContent, {
          base64: true
        })
        .then((z) => {
          payload.zipData = z;
          return payload;
        })
    };

    let storeGame = (payload) => {
      let {
        id,
        zipData
      } = payload;
      console.log('  > storing game');
      return new Promise((resolve, reject) => {
        zipData
          .generateNodeStream()
          .pipe(fs.createWriteStream(path.join(repoDir, id, `${id}.zip`)))
          .on('finish', () => {
            console.log('zip written to disk');
            resolve(payload);
          })
          .on('error', (e) => {
            reject(e);
          })
      });
    };

    let readManifest = (payload) => {
      console.log('  > readManifest');
      let {
        zipData
      } = payload;
      let matches = zipData
        .filter((file, data) => {
          // find the main json file which contains the game's id.
          // this json file will be in the root directory,
          // NOT under the assets/ directory.
          return (!/assets\//.test(file));
        });
      let gameFiles = zipData.filter((file, data) => {
        return (!data.dir);
      });
      payload.manifestStr = matches[0].async('text');
      return payload;
    }

    let getGameId = (payload) => {
      let {
        manifestStr
      } = payload;
      console.log(`  > getGameId`);
      return manifestStr.then((ms) => {
        let manifest = JSON.parse(ms);
        let id = manifest.id;
        payload.manifest = manifest;
        payload.id = id;
        return payload;
      });
    }

    let validateId = (payload) => {
      let {
        id
      } = payload;
      console.log(`  > validateId id:${id}`);
      if (typeof id === 'undefined') {
        throw new Error('A game ID was not found in the game data!');
      }
      if (!isGuid(id)) throw new Error('Game id was not a valid guid format')
      return payload;
    };


    let mkGameDir = (payload) => {
      console.log('  > mkGameDir');
      let {
        id
      } = payload;
      return fsp
        .mkdir(path.join(repoDir, id, 'raw', 'assets'), {
          recursive: true
        })
        .then((p) => {
          return payload;
        })
    };

    let writeRawFile = (filePath, buffer) => {
      return fsp.writeFile(filePath, buffer, {
        encoding: 'utf8'
      });
    };

    let writeRawFiles = (payload) => {
      console.log('  > writeRawFiles');
      let {
        id,
        zipData
      } = payload;
      let fileQueue = [];
      zipData.forEach((relPath, file) => {
        console.log(`file ${file.name}`)
        if (file.dir === false) {
          fileQueue.push(
            file.async('nodebuffer').then((buf) => {
              console.log(`    writing file ${file.name}`);
              return writeRawFile(path.join(repoDir, id, 'raw', file.name), buf);
            }));
        }
      });
      return new Promise.all(fileQueue).then(() => {
        return payload;
      });
    };


    unzip(payload)
      .then(readManifest)
      .then(getGameId)
      .then(validateId)
      .then(mkGameDir)
      .then(storeGame)
      .then(writeRawFiles)
      .then(resSuccess)
      .catch(resError)
  });


  app.get('/api/v1/game/:gameId', (req, res) => {
    // retrieve game json
    let gameId = req.params.gameId;
    if (typeof gameId === 'undefined')
      return res.send(400).json({
        msg: 'a gameId was not sent. gameId parameter is required!'
      });

    fsp.readFile(
      path.join(repoDir, gameId, 'raw', `${gameId}.json`), {
        encoding: 'utf-8'
      }
    ).then((file) => {
      res.json(file);
    });
  });

  app.get('/api/v1/game/:gameId/asset/:assetId', (req, res) => {
    // retrieve game json
    let {
      gameId,
      assetId
    } = req.params;
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

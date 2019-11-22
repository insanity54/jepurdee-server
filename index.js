require('dotenv').config()
const express = require('express');
const app = express();
const socketIoServer = require('./src/socketIoServer')(app);
const gameRepository = require('./src/gameRepository')(app, express);
const spaServer = require('./src/spaServer')(app, express);

socketIoServer.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});

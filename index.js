require('dotenv').config()
const express = require('express');
const app = express();
const { server, io } = require('./src/socketIoServer')(app);
const gameRepository = require('./src/gameRepository')(app, express);
const buzzer = require('./src/buzzer')(app, express, io);
const spaServer = require('./src/spaServer')(app, express);

server.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});

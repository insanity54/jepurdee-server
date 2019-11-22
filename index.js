require('dotenv').config()
const express = require('express');
const app = express();
// const cookieParser = require('cookie-parser');
// const session = require('./src/session');
const socketServer = require('./src/socketIoServer')(app);
const gameRepository = require('./src/gameRepository')(app, express);
// const routes = require('./src/routes')(app, session);

app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});

var Buzzer = require('./buzzer');

const main = () => {
  var server = require('http').createServer();
  var io = require('socket.io')(server);
  var buzzer = new Buzzer();

  io.on('connection', (socket) => {
    console.log(`Websockets connection established: ${socket.client.id}`)

    /**
     * Player events
     */
    socket.on('updatePlayerColor', (evt) => {
      socket.broadcast.emit('updatePlayerColor', evt);
    });

    socket.on('updatePlayerName', (evt) => {
      socket.broadcast.emit('updatePlayerName', evt);
    });

    socket.on('deletePlayer', (evt) => {
      socket.broadcast.emit('deletePlayer', evt);
    });

    socket.on('createPlayer', (evt) => {
      socket.broadcast.emit('createPlayer', evt);
    });

    socket.on('kickPlayer', (evt) => {
      socket.broadcast.emit('kickPlayer', evt);
    });

    socket.on('buzz', (evt) => {
      buzzer.logBuzz(evt);
    });

    /**
     * Game events
     */
    socket.on('startGame', (evt) => {
      socket.broadcast.emit('startGame', evt);
    });

    socket.on('unlockBuzzer', (evt) => {
      buzzer.unlockBuzzer();
      socket.broadcast.emit('unlockBuzzer', evt);
    });

    socket.on('lockBuzzer', (evt) => {
      buzzer.lockBuzzer();
      socket.broadcast.emit('lockBuzzer', evt);
    });


    /**
     * Host Events
     */
    socket.on('routeJumbotron', (evt) => {
      // example emission:
      // this.$socket.emit('routeJumbotron', { to: '/players' });
      socket.broadcast.emit('routeJumbotron', evt);
    });
  });

  server.listen(process.env.PORT, () => {
      console.log(`listening on port ${process.env.PORT}`);
  })

  return io;
};


module.exports = main;

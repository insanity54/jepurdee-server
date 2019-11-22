var Buzzer = require('./buzzer');
var SocketIO = require('socket.io');
var http = require('http');

const main = (app) => {
  var server = http.createServer(app);
  var io = SocketIO(server);
  var buzzer = new Buzzer();

  buzzer.winnerEmitter.on('buzzWinner', function (winner) {
    console.log(`the winner is ${winner}`)
    io.emit('buzzWinner', winner);
  })

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
      socket.broadcast.emit('buzz', evt);
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

    // socket.on('shareGame', (evt) => {
    //   socket.broadcast.emit('shareGame', evt);
    // });


    /**
     * Host Events
     */
    socket.on('routeToScreen', (data) => {
      // example emission:
      // this.$socket.emit('routeToScreen', { screenName: 'players' });
      console.log(`route to screen ${data.screenName}`);
      socket.broadcast.emit('routeToScreen', data);
    });
  });


  return io;
};


module.exports = main;

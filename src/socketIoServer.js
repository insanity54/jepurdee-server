var Buzzer = require('./buzzer');
var SocketIO = require('socket.io');
var http = require('http');

const main = (app) => {
  var server = http.createServer(app);
  var io = SocketIO(server);
  var buzzer = new Buzzer();

  buzzer.winnerEmitter.on('buzzWinner', function (winner) {
    console.log(`the winner is ${winner}`);
    io.emit('buzzWinner', winner);
  });

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

    socket.on('restartGame', (evt) => {
      socket.broadcast.emit('restartGame', evt);
    });

    socket.on('unlockBuzzer', (evt) => {
      buzzer.unlockBuzzer();
      socket.broadcast.emit('unlockBuzzer', evt);
    });

    socket.on('lockBuzzer', (evt) => {
      buzzer.lockBuzzer();
      socket.broadcast.emit('lockBuzzer', evt);
    });

    socket.on('revealCategory', (evt) => {
      socket.broadcast.emit('revealCategory', evt);
    });

    socket.on('revealAnswers', (evt) => {
      socket.broadcast.emit('revealAnswers', evt);
    });

    socket.on('openAnswer', (evt) => {
      socket.broadcast.emit('openAnswer', evt);
    });

    socket.on('doAnswerTimeout', (evt) => {
      socket.broadcast.emit('doAnswerTimeout', evt);
    });

    socket.on('doPlayerCorrect', (evt) => {
      socket.broadcast.emit('doPlayerCorrect', evt);
    });

    socket.on('doPlayerIncorrect', (evt) => {
      socket.broadcast.emit('doPlayerIncorrect', evt);
    });

    socket.on('setSelectedPlayer', (evt) => {
      socket.broadcast.emit('setSelectedPlayer', evt);
    });

    socket.on('submitWager', (evt) => {
      socket.broadcast.emit('submitWager', evt);
    });

    socket.on('routeToScreen', (evt) => {
      // example emission:
      // this.$socket.emit('routeToScreen', { screenName: 'players' });
      socket.broadcast.emit('routeToScreen', evt);
    });

    socket.on('buzzPlayer', (evt) => {
      socket.broadcast.emit('buzzPlayer', evt);
    })
  });


  return server;
};


module.exports = main;

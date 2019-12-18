var SocketIO = require('socket.io');
var http = require('http');

const main = (app) => {
  var server = http.createServer(app);
  var io = SocketIO(server);


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


    /**
     * Game events
     */
    socket.on('startGame', (evt) => {
      socket.broadcast.emit('startGame', evt);
    });

    socket.on('restartGame', (evt) => {
      socket.broadcast.emit('restartGame', evt);
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

    socket.on('doPlayerTimeout', (evt) => {
      socket.broadcast.emit('doPlayerTimeout', evt);
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
    });

    socket.on('setGameStarted', (evt) => {
      socket.broadcast.emit('setGameStarted', evt);
    });
  });


  return { server, io };
};


module.exports = main;

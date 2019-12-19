const path = require('path');
var Buzzer = require('./lib/buzzer');


const main = (app, express, io) => {

  var buzzer = new Buzzer();
  buzzer.winnerEmitter.on('buzzWinner', function (winner) {
    console.log(`the winner is ${winner}`);
    buzzer.lockBuzzer();
    io.emit('buzzWinner', winner);
    io.emit('lockBuzzer');
  });

  io.on('connection', (socket) => {
    socket.on('unlockBuzzer', (evt) => {
      buzzer.unlockBuzzer();
      socket.broadcast.emit('unlockBuzzer', evt);
    });

    socket.on('lockBuzzer', (evt) => {
      buzzer.lockBuzzer();
      socket.broadcast.emit('lockBuzzer', evt);
    });
    socket.on('buzz', (evt) => {
      socket.broadcast.emit('buzz', evt);
      buzzer.logBuzz(evt);
    });
  });


  app.post('/api/v1/lag-compensation', (req, res) => {
    let delay = req.body.delay;
    console.log(`setting lag compensation to ${delay}`);
    buzzer.setLagCompensation(delay);
    res.json({
      delay: delay
    })
  });

  app.get('/api/v1/lag-compensation', (req, res) => {
    let delay = buzzer.getLagCompensation();
    res.json({
      delay: delay
    });
  });
  return buzzer;
}

module.exports = main;

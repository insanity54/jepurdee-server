class Buzzer {
  constructor () {
    this.isLocked = false;
    this.buzzLog = [];
    this.secret = Math.floor(Math.random() * 1000000);
  }

  logBuzz(event) {
    if (this.isLocked) return;
    /**
     * example of how the client sends a buzz
     * this.$socket.emit('buzz', { id: this.pid, time: Date.now() });
     */
    this.buzzLog.push(event);
    console.log(` [BUZZ] player:${event.id} time:${event.time}`)
  }

  lockBuzzer() {
    console.log('buzzer lock')
    this.isLocked = true;
    this.buzzLog.push({
      id: this.secret,
      act: 'lock'
    });
  }

  unlockBuzzer() {
    console.log('buzzer unlock')
    this.isLocked = false;
    this.buzzLog.push({
      id: this.secret,
      act: 'unlock'
    });
  }

  decideWinner() {
    console.log(`and the winner is...`)
  }
}

module.exports = Buzzer;

/**
 * buzzer.js
 *
 * Buzzer signalling device decider
 * with latency compensation
 */

const EventEmitter = require('events');

class Buzzer {
  constructor () {
    this.lagCompensationDelay = 2750;
    this.isLocked = false;
    this.buzzLog = [];
    this.secret = Math.floor(Math.random() * 1000000);
    this.decisionTimer;
    this.unlockEpoch = null;
    this.winnerEmitter = new EventEmitter();
  }

  logBuzz(evt) {
    if (this.isLocked) return;
    /**
     * example of how the client sends a buzz
     * this.$socket.emit('buzz', { id: this.pid, time: Date.now() });
     */
    this.buzzLog.push(evt);
    // if previous event was an unlock,
    // and this event is a buzz,
    // this event contains the buzz winner.
    let previousEvent = this.buzzLog[this.buzzLog.length-2];
    let thisEvent = evt;

    if (typeof previousEvent === 'undefined') return;
    // console.log(` [BUZZ] player:${event.id} time:${event.buzzEpoch}. previousEvent:${previousEvent.id}, thisEvent:${thisEvent.id}`);

    if (
      previousEvent.act === 'unlock' &&
      typeof thisEvent.act === 'undefined'
    ) {
      // previous event was an unlock, this event is a buzz.
      // this means the first potential winner buzzed in.
      // in n seconds, choose the winner.
      this.decisionTimer = setTimeout(
        this.determineWinner.bind(this),
        this.lagCompensationDelay
      );
    }
  }

  lockBuzzer() {
    console.log('buzzer lock')
    this.isLocked = true;
    clearTimeout(this.decisionTimer);
    this.buzzLog.push({
      id: this.secret,
      act: 'lock',
      epoch: Date.now()
    });
  }

  unlockBuzzer() {
    console.log('buzzer unlock')
    this.isLocked = false;
    this.unlockEpoch = Date.now();
    this.buzzLog.push({
      id: this.secret,
      act: 'unlock',
      epoch: Date.now()
    });
  }

  /**
   * determineWinner based on the player's response time.
   * this is done to compensate for potential lag.
   * the winner is not necessarily the first buzz event which makes it to
   * the server.
   */
  determineWinner() {
    // winner is the buzz with the lowest delta between unlockEpoch and player buzz time
    // get list of potential winners
    // look at buzz timestamps.
    const isValidBuzzEvent = (evt) => {
      if (typeof evt.buzzEpoch === 'undefined') return false;
      if (evt.buzzEpoch < this.unlockEpoch) return false;
      return true;
    }


    let potentialWinnersList = this.buzzLog.filter(isValidBuzzEvent);
    console.log('potential Winners:');
    console.log(potentialWinnersList);

    // @TODO make it choose the player with the fastest reflex
    //       delta = (potentialWinner.buzzEpoch - this.unlockEpoch)
    //       thoose the player with the lowest delta
    // return this.winnerEmitter.emit('buzzWinner', thisEvent);
  }
}

module.exports = Buzzer;

/**
 * buzzer.js
 *
 * Buzzer signalling device decider
 * with latency compensation
 */

const EventEmitter = require('events');

class Buzzer {
  /**
   * lagCompensationDelay is how long Buzzer will wait before choosing a winner.
   *                      this allows slow phones and slow networks to participate
   *                      more fairly.
   * preUnlockDuration is the duration of time before the buzzer unlock which
   *                   will count as a penalty if a player buzzes during
   *
   * penaltyDuration is the penalty amount of time a player cannot buzz
   *
   */
  constructor () {
    this.lagCompensationDelay = 1500;
    this.preUnlockDuration = 500;
    this.penaltyDuration = 500;
    this.isLocked = false;
    this.buzzLog = [];
    this.secret = Math.floor(Math.random() * 1000000);
    this.decisionTimer;
    this.unlockEpoch = null;
    this.winnerEmitter = new EventEmitter();
  }

  logBuzz(evt) {
    /**
     * example of how the client sends a buzz
     * this.$socket.emit('buzz', { id: this.playerId, buzzEpoch: Date.now() });
     */
    let timeStampedBuzzEvent = {
      id: evt.id,
      buzzEpoch: evt.buzzEpoch,
      unlockEpoch: evt.unlockEpoch,
      reactionTime: (evt.buzzEpoch - evt.unlockEpoch),
      receivedEpoch: Date.now(),
    }
    this.buzzLog.push(timeStampedBuzzEvent);

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
    const isRelevantBuzzEvent = (evt) => {
      if (typeof evt.buzzEpoch === 'undefined') return false;
      let earliestConsideredEpoch = (this.unlockEpoch - this.preUnlockDuration);
      if (evt.buzzEpoch < earliestConsideredEpoch) return false;
      return true;
    }

    const returnLowestReactionTime = (acc, potentialWinner) => {
      if (potentialWinner.reactionTime < acc.reactionTime) return potentialWinner
      return acc;
    }


    // make it choose the player with the fastest reflex
    // delta = (potentialWinner.buzzEpoch - this.unlockEpoch)
    // thoose the player with the lowest delta
    let potentialWinners = this.buzzLog.filter(isRelevantBuzzEvent);
    console.log(potentialWinners)
    let winner = potentialWinners.reduce(returnLowestReactionTime);
    return this.winnerEmitter.emit('buzzWinner', winner);
  }
}

module.exports = Buzzer;

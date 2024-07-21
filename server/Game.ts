import fs from 'fs';
import path from 'path';
import { Pattern, PatternGenerator } from './Pattern';
import { User } from './User';
import { Players } from './GamePlayers';

const STARTING_LIVES = 5;
const SECONDS_PER_ROUND = 20;
const SECONDS_BETWEEN_ROUNDS = 1;

export class Game {
  players: Players[];
  currentPattern?: Pattern;
  finishRoundTimeout?: NodeJS.Timeout;
  static wordBank: string[]
  // todo: word history?

  constructor(users: User[]) {
    if (!Game.wordBank) {
      const filePath = path.join(__dirname, 'wordlist-20210729.txt');
      const data = fs.readFileSync(filePath, 'utf8');
      Game.wordBank = data.split('\n');
    }
    this.players = users.map(user => ({ user: user, lives: STARTING_LIVES }));
  }

  // returns true iff the guess is valid and will be accepted
  makeGuess(guess: string, socketId: string) {
    guess = guess.replace(/[^a-zA-Z]/g, '').toLowerCase();
    console.log(guess)
    console.log(socketId)
    console.log(this.currentPattern)
    console.log(Game.wordBank.includes(guess))
    console.log(this.currentPattern?.toRegex())
    console.log(this.currentPattern?.toRegex().test(guess))
    if (!this.currentPattern) {
      return;
    }
    const guesser = this.players.find(player => player.user.socket.id === socketId);
    if (!guesser) {
      throw new Error(`guesser socket ID ${socketId} not found in player list`);
    }
    if (!Game.wordBank.includes(guess)) {
      guesser.user.socket.emit("acceptance", "not a real word");
      return;
    }
    if (!this.currentPattern?.toRegex().test(guess)) {
      guesser.user.socket.emit("acceptance", "does not match pattern");
      return;
    }
    guesser.user.socket.emit("acceptance", ""); // means the word is actually accepted
    guesser.guess = guess;
    if (this.players.every(player => player.guess)) {
      clearTimeout(this.finishRoundTimeout);
      this.finishRound();
    }
  }

  start() {
    this.startNextRound();
  }

  private startNextRound() {
    this.players.forEach(player => {
      player.guess = undefined;
    });
    this.sendPlayerData();
    const nextPattern = PatternGenerator.instance.generateRandom(pattern => pattern.frequency > 1000);
    this.currentPattern = nextPattern;
    this.players.forEach(player => player.user.socket.emit("nextPattern", nextPattern.toString()));
    this.finishRoundTimeout = setTimeout(() => {
      this.finishRound();
    }, SECONDS_PER_ROUND * 1000);
  }

  private finishRound() {
    this.players.filter(player => player.lives > 0).filter(player => !player.guess).forEach(player => player.lives--);
    this.sendPlayerData()
    setTimeout(() => {
      if (this.players.length === 1 && this.players[0].lives === 0 // single-player game over
          || this.players.length > 1 && this.players.filter(player => player.lives > 0).length < 2) { // multi-player game over
        this.players.forEach(player => player.user.socket.emit("gameOver"));
      } else {
        this.startNextRound();
      }
    }, this.players.length === 1 ? 0 : SECONDS_BETWEEN_ROUNDS * 1000);
  }

  private sendPlayerData() {
    this.players.forEach(player => player.user.socket.emit("playerData", this.players.map<[string, { name: string, lives: number, guess: string }]>(player => [player.user.id, { name: player.user.name, lives: player.lives, guess: player.guess ?? "" }]).reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})));
  }
}
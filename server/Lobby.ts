import { Game } from "./Game";
import { User } from "./User";

export default class Lobby {
  users: Set<User> = new Set();
  game?: Game;

  constructor(public joinCode: string) {}

  join(user: User) {
    this.users.add(user);
    this.sendLobbyInfo();
  }
  
  leave(user: User) {
    this.users.delete(user);
    this.sendLobbyInfo();
  }

  sendLobbyInfo() {
    this.users.forEach(user => user.socket.emit("lobbyInfo", [...this.users].map(user => user.name)));
  }

  // todo: set custom game rules
}
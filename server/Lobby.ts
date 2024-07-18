import { Game } from "./Game";
import { User } from "./User";

export default class Lobby {
  users: Set<User> = new Set();
  game?: Game;

  constructor(public joinCode: string) {}

  join(user: User) {
    this.users.add(user);
  }

  leave(user: User) {
    this.users.delete(user);
  }

  // todo: set custom game rules
}
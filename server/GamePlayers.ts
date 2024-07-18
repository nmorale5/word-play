import { User } from "./User";

export interface Players {
  user: User,
  lives: number,
  guess?: string, // this player's successful guess matching the current pattern, if applicable
}
import type http from "http";
import { Server, Socket } from "socket.io";
import { User } from "./User";
import Lobby from "./Lobby";
import { Game } from "./Game";
let io: Server;

const socketToUserMap: Map<string, User> = new Map(); // maps socket ID to user object
const lobbies: Map<string, Lobby> = new Map(); // maps lobby code to lobby object

export const getUserFromSocketID = (socketid: string) => socketToUserMap.get(socketid);
export const getSocketFromSocketID = (socketid: string) => io.sockets.sockets.get(socketid);

export const init = (server: http.Server): void => {
  io = new Server(server);
  io.on("connection", (socket: Socket) => {
    console.log(`socket has connected ${socket.id}`);
    const currentUser: User = { id: "", socket: socket, name: "" };
    let currentLobby: Lobby;
    socketToUserMap.set(socket.id, currentUser);

    socket.on("setUserInfo", (id: string, name: string) => {
      const existingUser = [...socketToUserMap.values()].find(user => user.id === id);
      if (existingUser) {
        const oldSocketId = existingUser.socket.id;
        existingUser.socket = socket;
        existingUser.name = name;
        socketToUserMap.delete(oldSocketId);
        socketToUserMap.set(socket.id, existingUser);
      } else {
        currentUser.id = id;
        currentUser.name = name;
      }
    });

    socket.on("disconnect", () => {
      console.log(`socket has disconnected ${socket.id}`);
      socketToUserMap.delete(socket.id);
      if (currentLobby) {
        currentLobby.leave(currentUser)
        if (!currentLobby.users) {
          lobbies.delete(currentLobby.joinCode);
        }
      }
    });

    socket.on("joinLobby", (lobbyCode: string) => {
      let lobby = lobbies.get(lobbyCode);
      if (lobby) {
        lobby.join(currentUser);
      } else {
        lobby = new Lobby(lobbyCode);
        lobby.join(currentUser);
        lobbies.set(lobbyCode, lobby);
      }
      currentLobby = lobby;
    });

    socket.on("startGame", () => {
      if (currentLobby.game) {
        return;
      }
      const newGame = new Game([...currentLobby.users]);
      currentLobby.game = newGame;
      newGame.start();
    })
  });
};

export const getIo = () => io;

export default {
  getIo,
  init,
  getSocketFromSocketID,
  getUserFromSocketID,
};

import { RouteComponentProps } from "@reach/router";
import React from "react";
import { socket } from "../../client-socket";

const GameLobby = (props: RouteComponentProps) => {
  return (
    <>
      <h1>Lobby</h1>
      <button onClick={() => socket.emit("startGame")}>Start</button>
    </>
  )
};

export default GameLobby;

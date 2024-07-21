import { RouteComponentProps } from "@reach/router";
import React, { useEffect, useRef, useState } from "react";
import { socket } from "../../client-socket";

type PlayerData = { [key: string]: { name: string, guess: string, lives: number } };

const GameLobby = (props: RouteComponentProps) => {
  const [inGame, setInGame] = useState<boolean>(false);
  const [currentPattern, setCurrentPattern] = useState<string | undefined>(undefined);
  const [playerData, setPlayerData] = useState<PlayerData | undefined>(undefined);
  const [lobbyUsers, setLobbyUsers] = useState<string[] | undefined>(undefined);
  const [acceptanceMessage, setAcceptanceMessage] = useState<string | undefined>(undefined);

  const inputRef = useRef<HTMLInputElement>(null);

  const userId = localStorage.getItem("id");
  if (!userId) throw new Error("ID not found, should be redirecting to login page shortly...");
  const userName = localStorage.getItem("name");
  if (!userName) throw new Error("name not found, should be redirecting to login page shortly...");

  useEffect(() => {
    socket.emit("setUserInfo", userId, userName);
    const lobbyCode = new URLSearchParams(new URL(window.location.href).search).get("lobby");
    if (!lobbyCode) {
      throw new Error("lobby code is missing");
    }
    socket.emit("joinLobby", lobbyCode);
  }, [])

  useEffect(() => {
    socket.on("nextPattern", (pattern: string) => {
      setCurrentPattern(pattern);
      setAcceptanceMessage(undefined);
      setInGame(true);
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.value = "";
      }
    });
    socket.on("playerData", (pd: PlayerData) => {
      setPlayerData(pd);
    });
    socket.on("acceptance", (message: string) => {
      setAcceptanceMessage(message);
    })
    socket.on("gameOver", () => {
      setInGame(false);
    });
    socket.on("lobbyInfo", (users: string[]) => {
      setLobbyUsers(users);
    })
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("guess-button")?.click();
    }
  }

  const handleGuess = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const guessInput: HTMLInputElement = document.getElementById("guess");
    socket.emit("guess", guessInput.value);
  }

  return (
    inGame ? (
      <>
        <h1>{currentPattern}</h1>
        {acceptanceMessage === "" ? (
          <p>Waiting for other players...</p>
        ) : (
          <>
            <input id="guess" ref={inputRef} onKeyDown={handleKeyDown}></input>
            <button id="guess-button" onClick={handleGuess}>Enter</button>
          </>
        )}
        <div>
          {playerData && Object.keys(playerData).map(key => (
            <div key={key}>
              {playerData[key].name}: {playerData[key].lives} lives
            </div>
          ))}
        </div>
      </>
    ) : (
      <>
        <h1>{lobbyUsers?.length ?? 0} players in lobby</h1>
        <button onClick={() => socket.emit("startGame")}>Start Game</button>
      </>
    )
  );
};

export default GameLobby;

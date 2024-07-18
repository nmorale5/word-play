import React from "react";

import { RouteComponentProps } from "@reach/router";
import { socket } from "../../client-socket";

type Props = RouteComponentProps & {
  userId?: string;
};
const Home = (props: RouteComponentProps) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("join-button")?.click();
    }
  }

  const handleJoin = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const codeInput: HTMLInputElement = document.getElementById("join-code");
    window.location.replace(`/game?lobby=${codeInput.value}`);
  }

  return (
    <>
      <h2>Enter Lobby Code</h2>
      <input id="join-code" onKeyDown={handleKeyDown}></input>
      <button id="join-button" onClick={handleJoin}>Join</button>
    </>
  );
};

export default Home;

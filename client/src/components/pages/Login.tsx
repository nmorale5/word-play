import React, { useEffect } from "react";

import { RouteComponentProps } from "@reach/router";
import { socket } from "../../client-socket";

type Props = RouteComponentProps & {
  userId?: string;
};
const Login = (props: RouteComponentProps) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("username-button")?.click();
    }
  }

  const handleLogin = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const usernameInput: HTMLInputElement = document.getElementById("username");
    const name = usernameInput.value;
    if (!name) {
      return; // todo: display fail message and tell them to input an actual username
    }
    localStorage.setItem("name", name);
    let id = localStorage.getItem("id");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("id", id);
    }
    socket.emit("setUserInfo", id, name);
    window.location.replace("/");
  }

  return (
    <>
      <h2>Enter Username</h2>
      <input id="username" onKeyDown={handleKeyDown}></input>
      <button id="username-button" onClick={handleLogin}>Login</button>
    </>
  );
};

export default Login;
import React, { useState, useEffect } from "react";
import { Router } from "@reach/router";

import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import { socket } from "../client-socket";
import "../utilities.css";
import Login from "./pages/Login";
import GameLobby from "./pages/GameLobby";

const App = () => {
  useEffect(() => {
    socket.on("connect", () => {
      if (!localStorage.getItem("name") && window.location.pathname !== "/login") {
        window.location.replace("/login");
      }
    })
  }, []);

  // NOTE:
  // All the pages need to have the props extended via RouteComponentProps for @reach/router to work properly. Please use the Skeleton as an example.
  return (
    <Router>
      <Home path="/" />
      <Login path="/login" />
      <GameLobby path="/game" />
      <NotFound default={true} />
    </Router>
  );
};

export default App;

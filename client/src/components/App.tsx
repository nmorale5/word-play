import React, { useState, useEffect } from "react";
import { Router } from "@reach/router";

import { get, post } from "../utilities";
import NotFound from "./pages/NotFound";
import Skeleton from "./pages/Skeleton";
import { socket } from "../client-socket";
import "../utilities.css";

const App = () => {
  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    socket.on("connect", () => {
      post("/api/initsocket", { socketid: socket.id });
    })
  }, []);

  // NOTE:
  // All the pages need to have the props extended via RouteComponentProps for @reach/router to work properly. Please use the Skeleton as an example.
  return (
    <Router>
      <Skeleton path="/" userId={userId} />
      <NotFound default={true} />
    </Router>
  );
};

export default App;

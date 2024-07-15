import express, { Request, Response } from "express";
import http from "http";
import dotenv from "dotenv"; // Allows us to use environmental variables
import morgan from "morgan"; // Request logger (https://github.com/expressjs/morgan). Can be removed if you wish.
import path from "path"; // Allows us to retrieve file paths
import socketManager from "./server-socket"; // websockets
import api from "./api";
// Loads environmental variables
dotenv.config({});

// Create a new Express server
const app = express();

// Middleware setup.
app.use(express.json());
app.use(morgan("dev")); // To change the format of logs: https://github.com/expressjs/morgan#predefined-formats
app.use("/api", api);

// Serves the frontend code
const reactPath = path.resolve(__dirname, "..", "client", "dist");
app.use(express.static(reactPath));

// Fallbacks

// for all other routes, render index.html and let react router handle it
app.get("*", (req, res) => {
  res.sendFile(path.join(reactPath, "index.html"));
});

// Optional TODO (on your own) - Add an error interface.
app.use((err: any, _req: Request, res: Response) => {
  const status = err.status || 500;
  if (status === 500) {
    // 500 means Internal Server Error
    console.log("The server errored when processing a request!");
    console.log(err);
  }
  res.status(500);
  res.send({
    message: err.message,
    status,
  });
});

const port = process.env.PORT || 3000;
const server = http.createServer(app);
socketManager.init(server);
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

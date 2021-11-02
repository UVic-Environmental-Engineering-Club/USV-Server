import express from "express";
import http from "http";
import { Server } from "socket.io";

const PORT = 4000;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// define a route handler for the default home page
app.get("/", (req, res) => {
  res.send("Hello world!");
});

io.on("connection", () => {
  console.log("a user connected");
});

server.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}`);
});

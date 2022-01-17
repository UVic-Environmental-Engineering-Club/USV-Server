import express from "express";
import http from "http";
import { Server } from "socket.io";

const PORT = 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// define a route handler for the default home page
app.get("/", (req, res) => {
  res.send("Hello world!");
});

const usvNamespace = io.of("/usv");

usvNamespace.on("connection", (socket) => {
  console.log("a user connected");
  setInterval(() => {
    socket.emit("message", "hello");
  }, 1000);
});

server.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}`);
});

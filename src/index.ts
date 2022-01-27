import express from "express";
import http from "http";
import { Server } from "socket.io";

const PORT = 8080;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// define a route handler for the default home page
app.get("/", (req, res) => {
  res.send("Hello world!");
});

const usvNamespace = io.of("/usv");
const groundstationNamespace = io.of("/groundstation");

usvNamespace.on("connection", (socket) => {
  console.log("a user connected");
});

groundstationNamespace.on("connection", (socket) => {
  console.log("a user connected");
});

setInterval(() => {
  usvNamespace.emit("message", `motor ${Math.floor(Math.random() * 100)}%`);
}, 1000);

setInterval(() => {
  groundstationNamespace.emit(
    "log",
    `motor ${Math.floor(Math.random() * 100)}%`
  );
}, 1000);

server.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}`);
});

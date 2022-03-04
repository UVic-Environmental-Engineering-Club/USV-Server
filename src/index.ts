import express from "express";
import http from "http";
import { Server } from "socket.io";

interface Point {
  lat: number;
  long: number;
}

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
let currentRoute: Point[] = [];

usvNamespace.on("connection", (socket) => {
  console.log("a user connected to usv");
});

groundstationNamespace.on("connection", (socket) => {
  console.log("a user connected to groundstation");
  socket.emit("init_route", currentRoute);

  socket.on("add_point", (point: Point) => {
    currentRoute.push(point);
    groundstationNamespace.emit("add_point_ack", point);
    usvNamespace.emit("add_point_ack", point);
  });

  socket.on("delete_point", (point: Point) => {
    const newRoute = [...currentRoute];
    for (let i = 0; i < newRoute.length; i++) {
      if (newRoute[i].lat === point.lat && newRoute[i].long === point.long) {
        newRoute.splice(i, 1);
      }
    }
    currentRoute = newRoute;
    groundstationNamespace.emit("delete_point_ack", currentRoute);
    usvNamespace.emit("delete_point_ack", currentRoute);
  });

  socket.on("clear_route", () => {
    currentRoute = [];
    groundstationNamespace.emit("clear_route_ack");
    usvNamespace.emit("clear_route_ack");
  });
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

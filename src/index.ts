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
const currentRoute: Point[] = [];
const currentShore: Point[] = [];

usvNamespace.on("connection", (socket) => {
  console.log("a user connected to usv");
});

groundstationNamespace.on("connection", (socket) => {
  console.log("a user connected to groundstation");
  socket.emit("init_route", currentRoute);

  socket.on(
    "add_point",
    ({ point, isRoute }: { point: Point; isRoute: boolean }) => {
      const updateMessage = isRoute ? "update_route_ack" : "update_shore_ack";
      const list = isRoute ? currentRoute : currentShore;
      const eventMessage = isRoute
        ? "add_point_route_ack"
        : "add_point_shore_ack";

      list.push(point);

      groundstationNamespace.emit(eventMessage, list);
      usvNamespace.emit(updateMessage, list);
    }
  );

  socket.on(
    "delete_point",
    ({ point, isRoute }: { point: Point; isRoute: boolean }) => {
      const updateMessage = isRoute ? "update_route_ack" : "update_shore_ack";
      const eventMessage = isRoute
        ? "delete_point_route_ack"
        : "delete_point_shore_ack";
      const list = isRoute ? currentRoute : currentShore;
      for (let i = 0; i < list.length; i++) {
        if (list[i].lat === point.lat && list[i].long === point.long) {
          list.splice(i, 1);
        }
      }

      groundstationNamespace.emit(eventMessage, list);
      usvNamespace.emit(updateMessage, list);
    }
  );

  socket.on("clear_route", (isRoute: boolean) => {
    const list = isRoute ? currentRoute : currentShore;
    const updateMessage = isRoute ? "update_route_ack" : "update_shore_ack";
    const eventMessage = isRoute ? "clear_route_ack" : "clear_shore_ack";

    list.splice(0, list.length);
    groundstationNamespace.emit(eventMessage, list);
    usvNamespace.emit(updateMessage, list);
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

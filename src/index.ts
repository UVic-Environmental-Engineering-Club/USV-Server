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
  socket.emit("init_route", currentRoute);
  socket.emit("init_shore", currentShore);

  socket.on("serial", (data: { type: string; data: any }) => {
    let message = "serial";
    if (data.type === "GPS") message = "usv_gps";

    groundstationNamespace.emit(message, data);
  });
});

groundstationNamespace.on("connection", (socket) => {
  console.log("a user connected to groundstation");
  socket.emit("init_route", currentRoute);
  socket.emit("init_shore", currentShore);

  socket.on(
    "add_point",
    ({ point, isRoute }: { point: Point; isRoute: boolean }) => {
      const usvMessage = isRoute ? "update_route_ack" : "update_shore_ack";
      const list = isRoute ? currentRoute : currentShore;
      const groundstationMessage = isRoute
        ? "add_point_route_ack"
        : "add_point_shore_ack";

      list.push(point);

      groundstationNamespace.emit(groundstationMessage, list);
      usvNamespace.emit(usvMessage, list);
    }
  );

  socket.on(
    "delete_point",
    ({ point, isRoute }: { point: Point; isRoute: boolean }) => {
      const usvMessage = isRoute ? "update_route_ack" : "update_shore_ack";
      const groundstationMessage = isRoute
        ? "delete_point_route_ack"
        : "delete_point_shore_ack";
      const list = isRoute ? currentRoute : currentShore;
      for (let i = 0; i < list.length; i++) {
        if (list[i].lat === point.lat && list[i].long === point.long) {
          list.splice(i, 1);
        }
      }

      groundstationNamespace.emit(groundstationMessage, list);
      usvNamespace.emit(usvMessage, list);
    }
  );

  socket.on("clear_route", (isRoute: boolean) => {
    const list = isRoute ? currentRoute : currentShore;

    list.splice(0, list.length);
    groundstationNamespace.emit("clear_route_ack", list);
    usvNamespace.emit("update_route_ack", list);
  });

  socket.on("clear_shore", (isRoute: boolean) => {
    const list = isRoute ? currentShore : currentRoute;

    list.splice(0, list.length);

    groundstationNamespace.emit("clear_shore_ack", list);
    usvNamespace.emit("update_shore_ack", list);
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

"use strict";

require("dotenv").config();

const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Chess } = require("chess.js");
const { Server } = require("socket.io");
const io = new Server(server);
const checkXSS = require("./xss.js");
const port = process.env.port ? process.env.port : 8080;

// making public folder available, contains html, scripts, css, images
app.use(express.static(`${__dirname}/public`));

// making chessboardjs files available
app.use(
  express.static(`${__dirname}/node_modules/@chrisoakman/chessboardjs/dist/`)
);
// making chess.js files available
app.use(express.static(`${__dirname}/node_modules/chess.js/`));

// answering / get requests with index.html
app.get("/", (_req, res) => {
  res.sendFile(`${__dirname}/public/views/index.html`);
});

// keeping track of all the rooms
const rooms = [];

// if a client is trying to join a room that exists,
// the client will get che chess-page.html otherwise it will get be redirected to /
app.get("/play/online", (req, res) => {
  if (rooms.find((room) => room.name === checkXSS(req.query.roomName))) {
    res.sendFile(`${__dirname}/public/views/online.html`);
  } else {
    res.redirect("/");
  }
});

app.get("/play/bot", (req, res) => {
  res.sendFile(`${__dirname}/public/views/bot.html`);
});

app.get("/play", (req, res) => {
  res.redirect("/");
});

app.get("*", (req, res) => {
  res.send("404");
});

// handle user connection to server through socket
io.on("connection", (skt) => {
  const socket = checkXSS(skt);

  // console.log("user connected");
  socket.emit("room_list", rooms);

  // preparing variables to store roomName and userName
  let roomNameSocket = "";
  let userNameSocket = "";

  // handling create_room event
  socket.on("create_room", (type, name, algorithmName, depth, time) => {
    // check if rooms contains a room with name name
    if (rooms.find((room) => room.name === name)) {
      // if room already exists, don't create a new room
      console.log("room already exists:", name);
      return;
    }
    console.log("creating room:", name);
    // create a new room and add it to rooms array
    rooms.push({
      name,
      white: {},
      black: {},
      spectators: [],
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      restart: "",
      switch: "",
    });
  });

  // handling join_room event
  socket.on("join_room", (peer_name, peer_userName) => {
    const name = checkXSS(peer_name);
    const userName = checkXSS(peer_userName)

    console.log(userName, "is joining room", name);

    // find room the user want to join
    const room = rooms.find((r) => r.name === name);
    if (room) {
      // if room exists, socket joins room
      socket.join(name);
      if (Object.keys(room.white).length === 0) {
        // if room.white is empty, user is white
        room.white.id = socket.id;
        room.white.name = userName;
        socket.emit("side", "w");
      } else if (Object.keys(room.black).length === 0) {
        // if room.black is empty, user is black
        room.black.id = socket.id;
        room.black.name = userName;
        socket.emit("side", "b");
      } else {
        // if room is full, user is spectator
        room.spectators.push({ name: userName, id: socket.id });
        socket.emit("side", "s");
      }
      roomNameSocket = room.name;
      userNameSocket = userName;
    }
    // sending room_status event to all members of this room
    io.to(room.name).emit("room_status", room);

    // update everyone's room list
    io.emit("room_list", rooms);
  });

  socket.on("move", (config) => {
    const san = checkXSS(config);

    // find correct room
    const room = rooms.find((r) => r.name === roomNameSocket);

    if (room) {
      // update game status
      const game = new Chess(room.fen);
      const move = game.move(san);
      room.fen = game.fen();

      io.to(room.name).emit("update_board", room.fen, move.san);
      io.to(room.name).emit("move", move);
    }
  });

  socket.on("restart_request", () => {
    const room = rooms.find((r) => r.name === roomNameSocket);
    switch (socket.id) {
      case room.white.id:
        room.restart = "w";
        io.to(room.black.id).emit("restart_requested");
        console.log("restart requested by white");
        break;
      case room.black.id:
        room.restart = "b";
        io.to(room.white.id).emit("restart_requested");
        console.log("restart requested by black");
        break;
      default:
        console.log("unknown user requested restart");
        break;
    }
    io.to(room.name).emit("room_status", room);
  });

  socket.on("restart_grant", () => {
    const room = rooms.find((r) => r.name === roomNameSocket);
    console.log("restart_grant");
    if (
      (room.restart === "w" && socket.id === room.black.id) ||
      (room.restart === "b" && socket.id === room.white.id)
    ) {
      console.log("restart granted");
      room.fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
      room.restart = "";
      io.to(room.name).emit("room_status", room);
      io.to(room.name).emit("update_board", room.fen, null);
    }
  });

  // same as restart_request but for switching sides
  socket.on("switch_request", () => {
    console.log("switch request");
    const room = rooms.find((r) => r.name === roomNameSocket);

    switch (socket.id) {
      case room.white.id:
        room.switch = "w";
        io.to(room.black.id).emit("switch_requested");
        console.log("switch requested by white");
        break;
      case room.black.id:
        room.switch = "b";
        io.to(room.white.id).emit("switch_requested");
        console.log("switch requested by black");
        break;
      default:
        console.log("unknown user requested switch");
        break;
    }
    io.to(room.name).emit("room_status", room);
  });

  socket.on("switch_grant", () => {
    const room = rooms.find((r) => r.name === roomNameSocket);
    if (
      (room.switch === "w" && socket.id === room.black.id) ||
      (room.switch === "b" && socket.id === room.white.id)
    ) {
      console.log("switching sides");
      room.fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
      const { white } = room;
      room.white = room.black;
      room.black = white;
      room.switch = "";
      room.restart = "";
      io.to(room.white.id).emit("side", "w");
      io.to(room.black.id).emit("side", "b");
      io.to(room.name).emit("room_status", room);
      io.to(room.name).emit("update_board", room.fen);
    }
  });

  // handling user disconnection
  socket.on("disconnect", () => {
    console.log("user disconnected");
    if (roomNameSocket) {
      // find correct room
      const room = rooms.find((r) => r.name === roomNameSocket);
      if (room.white.id === socket.id) {
        // if user is white, remove from white spot
        console.log(
          userNameSocket,
          "removed as white player from room",
          roomNameSocket
        );
        room.white = {};
      } else if (room.black.id === socket.id) {
        // if user is black, remove from black spot
        console.log(
          userNameSocket,
          "removed as black player from room",
          roomNameSocket
        );
        room.black = {};
      } else {
        // if user is spectator, remove from spectators list
        console.log(
          userNameSocket,
          "removed as spectator player from room",
          roomNameSocket
        );
        room.spectators = room.spectators.filter(
          (spectator) => spectator.id !== socket.id
        );
      }
      // send updated room information to all members of this room
      io.to(room.name).emit("room_status", room);

      // if room is empty, remove it from rooms list
      if (
        Object.keys(room.white).length === 0 &&
        Object.keys(room.black).length === 0 &&
        room.spectators.length === 0
      ) {
        console.log("room removed:", roomNameSocket);
        rooms.splice(rooms.indexOf(room), 1);
        // update everyone's room list
        io.emit("room_list", rooms);
      }
    }
  });
});

// start server
server.listen(port, () => {
  if (ngrokEnabled) {
    ngrokStart();
  } else {
    console.log(`listening on port:${server.address().port}`);
  }
});


// NGROK CONFIGURATION
const ngrok = require("ngrok");
const ngrokEnabled = process.env.NGROK_ENABLED == "true" ? true : false;
const ngrokAuthToken = process.env.NGROK_AUTH_TOKEN;

async function ngrokStart() {
  try {
    await ngrok.authtoken(ngrokAuthToken);
    await ngrok.connect(port);
    const api = ngrok.getApi();
    const data = await api.listTunnels();
    const pu0 = data.tunnels[0].public_url;
    const pu1 = data.tunnels[1].public_url;
    const tunnelHttps = pu0.startsWith("https") ? pu0 : pu1;
    // server settings
    console.log("localhost setup on --> " + "http://localhost:" + port);
    console.log("Server running on -->  " + tunnelHttps);
  } catch (err) {
    console.error("[Error] ngrokStart", err);
    process.exit(0);
  }
}

process.on("SIGINT", () => {
  console.log("SERVER CLOSED from port: ", port);
  process.exit(0);
});

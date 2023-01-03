const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const {ChessBoard, Piece} = require("../chess.js");

app.get('/', (req, res) => {
  res.send("<h1>Hello world</h1>");
});

board = ChessBoard.startingPosition();
sockets = [];
io.on("connection", (socket) => {
  console.log("a user connected");
  sockets.push(socket);
  socket.on("ping", () => {
    console.log("received ping");
    socket.emit("pong");
  });
  socket.on("move", (move) => {
    console.log("received move request");
    [iRow, iCol, fRow, fCol] = move;
    if(board.validMove(iRow, iCol, fRow, fCol)) {
      board.move(iRow, iCol, fRow, fCol);
      socket.emit("moved");
      for(let i = 0; i < sockets.length; i++) {
        sockets[i].emit("board", board.toString());
      }
    }
  });
  socket.on("board", () => {
    console.log("received board request");
    socket.emit("board", board.toString());
  });
  socket.on("disconnect", () => {
    console.log("a user disconnected");
    let index = sockets.indexOf(socket);
    sockets.splice(index, 1);
  });
  socket.on("init", (ack) => {
    ack({board: board.toString()});
  });
});

io.on("disconnect", (socket) => {
  console.log("a user disconnected");
  sockets.remove(socket);
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});

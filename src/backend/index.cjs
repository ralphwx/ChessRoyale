const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server);
const {ServerGame} = require("./game.cjs");
const {ChessGame, Piece} = require("../chess.js");

const open_challenges = [];

//TODO: when the user disconnects, kick them out of the game to prevent memory
//leak
//console.log(ServerGame);
//let a = new ServerGame();
//console.log(a.boardState);
//console.log(a.setReady);
//console.log(a.bothReady);
//console.log(a.move);
//console.log(a.getListeners);

//returns the index in open_challenges of the challenge issued by [socket]
//return -1 if not found.
function find_challenge(id) {
  for(let i = 0; i < open_challenges.length; i++) {
    if(open_challenges[i][0].id === id) return i;

  }
  return -1;
}

function set_lobby(socket) {
  console.log(socket.id + " joined the lobby");
  socket.removeAllListeners();

  socket.on("create", (ack) => {
    //create new challenge
    if(find_challenge(socket.id) === -1) {
      open_challenges.push([socket, new ServerGame()]);
      ack();
    }
  });

  socket.on("cancel", (ack) => {
    //cancel the challenge
    let i = find_challenge(socket.id);
    if(i !== -1) {
      open_challenges.splice(i, 1);
      ack();
    }
  });

  socket.on("lobby", (ack) => {
    output = [];
    for([id, game] of open_challenges) {
      output.push({
        id: id.id,
      });
    }
    ack(output);
  });

  socket.on("join", (id) => {
    let index = find_challenge(id);
    if(socket.id === id || index === -1) return;
    [csocket, game] = open_challenges[index];
    open_challenges.splice(index, 1);
    socket.emit("joined", "black");
    csocket.emit("joined", "white");
    set_game(socket, game, "black");
    set_game(csocket, game, "white");
  });
}

function set_game(socket, game, color) {
  console.log(socket.id + " joined game");
  socket.removeAllListeners();
  game.addListener(socket);

  socket.on("move", (move, ack) => {
    [iRow, iCol, fRow, fCol] = move;
    if(game.move(iRow, iCol, fRow, fCol, (color === "white"))) {
      ack();
      for(socket of game.getListeners()) {
        socket.emit("board", game.boardState());
      }
    }
  });
  socket.on("ready", (ack) => {
    game.setReady(color);
    if(game.bothReady()) {
      let now = Date.now();
      for(s of game.getListeners()) {
        s.emit("started", now);
      }
    }
    ack();
  });
  socket.on("leave", () => {
    console.log(socket.id + "left game");
    set_lobby(socket);
    game.removeListener(socket);
  });
  socket.emit("board", game.boardState());
}

io.on("connection", (socket) => {
  set_lobby(socket);
});

server.listen(3000, () => {
  console.log("Listening on *:3000");
});

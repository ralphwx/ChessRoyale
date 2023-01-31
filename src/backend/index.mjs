
//backend code to be run in NodeJS

//set up express
import express from "express";
const app = express();
import {createServer} from "http";
const server = createServer(app);

app.use(express.static("../../main"));

app.get("/", (req, res) => {
  res.sendFile("/Users/rwx/JS/chessroyale/main/index.html");
});

app.get("/login", (req, res) => {
  res.sendFile("/Users/rwx/JS/chessroyale/main/login/index.html");
});

//set up socket.io
import {Server} from "socket.io";
const io = new Server(server);
import {ServerGame} from "./servergame.mjs";
import {Color} from "../enums.mjs";

const open_challenges = [];

//TODO: when the user disconnects, kick them out of the game?

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

  function cancelChallenge(ack) {
    let i = find_challenge(socket.id);
    if(i !== -1) {
      open_challenges.splice(i, 1);
      ack();
    }
  }
  socket.on("create", (ack) => {
    //create new challenge
    if(find_challenge(socket.id) === -1) {
      open_challenges.push([socket, new ServerGame()]);
      ack();
    }
  });

  socket.on("cancel", (ack) => cancelChallenge(ack));

  socket.on("lobby", (ack) => {
    let output = [];
    for(let [id, game] of open_challenges) {
      output.push({
        id: id.id,
      });
    }
    ack(output);
  });

  socket.on("join", (id) => {
    let index = find_challenge(id);
    if(socket.id === id || index === -1) return;
    let [csocket, game] = open_challenges[index];
    open_challenges.splice(index, 1);
    socket.emit("joined", Color.BLACK);
    csocket.emit("joined", Color.WHITE);
    set_game(socket, game, Color.BLACK);
    set_game(csocket, game, Color.WHITE);
  });

  socket.on("disconnect", () => {
    cancelChallenge(() => {});
  });
}

function set_game(socket, game, color) {
  console.log(socket.id + " joined game");
  socket.removeAllListeners();
  game.addListener(socket);

  socket.on("move", (move, ack) => {
    let [iRow, iCol, fRow, fCol] = move;
    if(game.move(iRow, iCol, fRow, fCol, color)) {
      ack();
      for(let s of game.getListeners()) {
        s.emit("board", game.boardState());
      }
      let result = game.gameOver();
      if(result.gameOver) {
        for(let s of game.getListeners()) {
          s.emit("gameover", result.winner);
        }
      }
    }
  });
  socket.on("ready", (ack) => {
    game.setReady(color);
    if(game.bothReady()) {
      let now = Date.now();
      for(let s of game.getListeners()) {
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
  socket.on("disconnect", () => {
    game.removeListener(socket);
  });
  socket.emit("board", game.boardState());
}

io.on("connection", (socket) => {
  set_lobby(socket);
});

server.listen(8080, () => {
  console.log("Listening on *:8080");
});

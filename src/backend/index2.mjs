
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

app.get("/game", (req, res) => {
  res.sendFile("/Users/rwx/JS/chessroyale/main/game/index.html");
});

import {Server} from "socket.io";
const io = new Server(server);
import {LobbyData} from "./lobbydata.mjs";
import {userExists, authenticate, getElo, setElo, createUser, deleteUser} from "./users.mjs";

//lobbydata is a data structure keeping track of challenges and games
//invariant: lobbydata keeps track of all queued up challenges, including
// all open and private challenges
//invariant: a user can have at most one open challenge at a time, whether 
// that's a public or private challenge
//invariant: if a user is in a game, they cannot have any open or private 
// challenge up
//invariant: each user can only have one active connection to the site at
// once. This invariant will be maintained by keeping track of socket, userID
// pairs, and only allow request on behalf of any user to come from the
// specified socket

let lobbydata = new LobbyData();
//sockets is a map from usernames to sockets.
//invariant: for each user, the map contains the corresponding socket.
//Logged out users are not represented in [sockets].
let sockets = new Map();

io.on("connection", (socket) => {
  let user = null; //invariant: user is the identity of the connecting
                   //socket.
                   //invariant: if user is not null, the sockets[user] = socket
  //user requests to make an open challenge
  socket.on("open_challenge", () => {
    if(user !== null) lobbydata.makeOpenChallenge(user);
  });
  //user requests to make a private challenge
  socket.on("private_challenge", (opponent) => {
    if(user !== null && sockets.get(user) !== null) {
      lobbydata.makePrivateChallenge(user, opponent);
    }
  });
  //user tries to cancel their challenge
  socket.on("cancel_challenge", () => {
    if(user !== null) lobbydata.cancelChallenge(user);
  });
  //user tries to join a game
  socket.on("join", (opponent, ack) => {
    if(user === null) ack(false);
    let attempt = lobbydata.attemptJoin(user, opponent);
    ack(attempt);
  });
  socket.on("disconnect", () => {
    if(user === null) return;
    if(sockets.get(user) === socket) sockets.delete(user);
    else {
      lobbydata.userDisconnected(user);
    }
  });
  //user tries to make a move in their current game
  socket.on("move", (move, ack) => {
    if(user === null) ack(false);
    if(lobbydata.attemptMove(user, move)) {
      let board = lobbydata.getBoard(user);
      let opponent = sockets.get(lobbydata.getOpponent(user));
      if(opponent !== null) opponent.emit("board", board);
      socket.emit("board", board);
      ack(true);
    }
    ack(false);
  });
  //user declares that they're ready in the game
  socket.on("ready", (ack) => {
    if(user === null) ack(false);
    ack(true);
    if(lobbydata.declareReady(user)) {
      sockets.get(lobbydata.getOpponent(user)).emit("game_start");
      socket.emit("game_start");
    }
  });
  //request for lobby data
  socket.on("lobby", (ack) => {
    let output = lobbydata.getChallenges(user);
    ack(output);
  });
  //request to login
  socket.on("login", (username, password, ack) => {
    if(!username || !userExists(username) || !authenticate(username, password)){
      ack(false);
    }
    user = username;
    let prev = sockets.get(user);
    if(prev) prev.emit("evicted");
    sockets.set(user, socket);
    ack(true);
    //if user is in a game, send the board state
    if(lobbydata.getOpponent(user) !== null) {
      socket.emit("board", lobbydata.getBoard(user));
    }
  });
  //request to log out
  socket.on("logout", (ack) => {
    if(user === null) ack(false);
    if(sockets.get(user) === socket) delete(user);
    user = null;
    ack(true);
  });
  //request for game metadata
  socket.on("gamedata", (ack) => {
    if(user !== null && lobbydata.getOpponent(user) !== null) {
      ack(lobbydata.getGameData(user));
    }
  });
});


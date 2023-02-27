
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

import {AuthServer} from "./authserver.mjs";
const authserver = new AuthServer(server, "./users/");
import {LobbyData} from "./lobbydata.mjs";
import {UserManager} from "./users.mjs";
import {Color} from "../enums.mjs";

let lobbydata = new LobbyData();

let users = new UserManager("./users");

//attempts to make an open challenge, does nothing if unsuccessful
authserver.addEventHandler("open_challenge", (user) => {
  lobbydata.makeOpenChallenge(user);
});

//attempts to make a private challenge. Requires args to have a field [opponent]
// representing the receiver of the challenge. ack is the callback function,
// takes a boolean argument: true if the challenge creation was successful
// ie, whether the opponent exists, false otherwise.
authserver.addEventHandler("private_challenge", (user, args, ack) => {
  if(users.userExists(args.opponent)) {
    lobbydata.makePrivateChallenge(user, args.opponent);
    ack(true);
  } else ack(false);
});

//attempts to cancel the existing challenge, does nothing if unsuccessful.
authserver.addEventHandler("cancel_challenge", (user) => {
  lobbydata.cancelChallenge(user);
});

//attempts to join the challenge created by args.oppoent. Requires args to have
//a field opponent.
authserver.addEventHandler("join", (user, args) => {
  let result = lobbydata.attemptJoin(user, args.opponent);
  if(result) {
    authserver.notify(user, "joined");
    authserver.notify(args.opponent, "joined");
  }
});

//calls ack with lobby data for the given user as a list of objects, sorted in
//the order: outgoing challenge, incoming private challenges, then public
//challenges.
//each challenge has the object format:
//  {
//    sender: [user who issued the challenge]
//    senderElo: [sender's elo]
//    receiver: [user who the challenge is issued to, or empty string if open]
//    receiverElo: [receiver's elo]
//  }
authserver.addEventHandler("lobby", (user, args, ack) => {
  let data = lobbydata.getLobbyData(user);
  data = data.map(x => {
    let senderElo = users.getElo(x.sender);
    let receiverElo = undefined;
    if(x.receiver.length > 0) receiverElo = users.getElo(x.receiver);
    return Object.assign({senderElo: senderElo, receiverElo: receiverElo}, x);
  });
  ack(data);
});

function gameOver(user) {
  let game = lobbydata.getGame(user);
  let meta = game.metaData();
  authserver.notify(meta.white, "gameover", game.gameState());
  authserver.notify(meta.black, "gameover", game.gameState());
  if(game.gameState().winner === Color.WHITE) {
    users.setElo(meta.white, users.getElo(meta.white) + 8);
    users.setElo(meta.black, users.getElo(meta.black) - 8)
  } else {
    users.setElo(meta.white, users.getElo(meta.white) - 8);
    users.setElo(meta.black, users.getElo(meta.black) + 8);
  }
}

//game side requests
authserver.addEventHandler("move", (user, args, ack) => {
  //TODO
});
authserver.addEventHandler("ready", (user, args, ack) => {
  //TODO
});
authserver.addEventHandler("draw", (user, args, ack) => {
  //TODO
});
authserver.addEventHandler("resign", (user, args, ack) => {
  //update the game state to 'user' resigned
  //notify both players
  let game = lobbydata.getGame(user);
  if(game === undefined || !game.gameState().ongoing) return;
  game.resign(user)
  gameOver(user);
});
authserver.addEventHandler("abort", (user, args, ack) => {
  //TODO
});
//returns a metadata object describing the game the current user is in
//requires the user to be in a game.
authserver.addEventHandler("gamedata", (user, args, ack) => {
  let game = lobbydata.getGame(user);
  if(game === undefined) return;
  let data = game.metaData();
  data.whiteElo = users.getElo(data.white);
  data.blackElo = users.getElo(data.black);
  data.whiteOnline = authserver.isOnline(data.white);
  data.blackOnline = authserver.isOnline(data.black);
  ack(data);
});

server.listen(8080, () => {
  console.log("listening on *:8080");
});


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

let lobbydata = new LobbyData();

let users = new UserManager("./users");
//TODO: add the acknowledgement function calls when making client side.
//Lobby side requests
authserver.addEventHandler("open_challenge", (user, args, ack) => {
  lobbydata.makeOpenChallenge(user);
});
authserver.addEventHandler("private_challenge", (user, args, ack) => {
  lobbydata.makePrivateChallenge(user, args.opponent);
});
authserver.addEventHandler("cancel_challenge", (user, args, ack) => {
  lobbydata.cancelChallenge(user);
});
authserver.addEventHandler("join", (user, args, ack) => {
  lobbydata.attemptJoin(user, args.opponent);
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
  //data = lobbydata.getLobbyData(user);
  let data = [
    {
      sender: user,
      senderElo: users.getElo(user),
      receiver: "Arturo",
      receiverElo: 2015,
    },
    {
      sender: "jtsub",
      senderElo: 1951,
      receiver: user,
      receiverElo: users.getElo(user),
    },
    {
      sender: "tiny25",
      senderElo: 1880,
      receiver: "",
    },
    {
      sender: "mmock721",
      senderElo: 722,
      receiver: "",
    }
  ]
  if(Math.random() < 0.5) {
    let temp = data[2];
    data[2] = data[1];
    data[1] = temp;
  }
  ack(data);
});

//game side requests
authserver.addEventHandler("move", (user, args, ack) => {
  //TODO
});
authserver.addEventHandler("ready", (user, args, ack) => {
  //TODO
});
authserver.addEventHandler("gamedata", (user, args, ack) => {
  //TODO
});

server.listen(8080, () => {
  console.log("listening on *:8080");
});

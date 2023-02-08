
import {UserManager} from "./users.mjs";
import {ServerGame} from "./servergame.mjs";
import {SocketManager} from "./socketmanager.mjs";

let users = new UserManager("./users/");
class LobbyData {
  constructor() {
    this.openChallenges = [];
    this.privateSenders = new Map();
    this.privateReceivers = new SocketManager();
    this.games = new Map();
  }
  getLobbyData(user) {
    let output = [];
    //first check if the user sent out a challenge
    if(this.openChallenges.indexOf(user) !== -1) {
      output.push({
        sender: user,
        senderElo: users.getElo(user),
        receiver: "",
      });
    }
    let privateOpponent = this.privateSenders.get(user);
    if(privateOpponent !== undefined) {
      output.push({
        sender: user,
        senderElo: users.getElo(user),
        receiver: privateOpponent,
        receiverElo: users.getElo(privateOpponent),
      });
    }
    //next check for private challenges going to the user
    for(let sender of this.privateReceivers.get(user)) {
      output.push({
        sender: sender,
        senderElo: users.getElo(sender),
        receiver: user,
        receiverElo: users.getElo(user),
      });
    }
    //next add all public challenges
    for(let sender of this.openChallenges) {
      if(sender !== user) {
        output.push({
          sender: sender,
          senderElo: users.getElo(sender),
          receiver: "",
        });
      }
    }
    return output;
  }
  makeOpenChallenge(user) {
    if(this.games.get(user) !== undefined) return;
    if(this.openChallenges.indexOf(user) !== -1) return;
    this.cancelChallenge(user);
    this.openChallenges.push(user);
  }
  makePrivateChallenge(user, opponent) {
    if(this.games.get(user) !== undefined) return;
    this.cancelChallenge(user);
    this.privateSenders.set(user, opponent);
    this.privateReceivers.add(opponent, user);
  }
  cancelChallenge(user) {
    let index = this.openChallenges.indexOf(user);
    if(index !== -1) {
      this.openChallenges.splice(index, 1);
      return;
    }
    let privateOpponent = this.privateSenders.get(user);
    if(privateOpponent !== undefined) {
      this.privateSenders.delete(user);
      this.privateReceivers.remove(privateOpponent, user);
    }
  }
  attemptJoin(user, sender) {
    if(this.privateSenders.get(sender) === user
      || this.openChallenges.indexOf(sender) !== -1) {
      this.cancelChallenge(user);
      this.cancelChallenge(sender);
      let gamedata = new ServerGame();
      this.games.set(user, [sender, new ServerGame()]);
      this.games.set(sender, [user, new ServerGame()]);
      return true;
    }
    return false;
  }
  getBoard(user) {
    let i = this.gameIndex();
    if(i === -1) throw "User is not in a game";
    return this.games[i][2].boardState();
  }
  getOpponent(user) {
    
  }
  getChallenges(user) {

  }
  declareReady(user) {

  }
  attemptMove(user) {

  }
}

export {LobbyData};

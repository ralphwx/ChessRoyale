
import {ServerGame} from "./servergame.mjs";
import {SocketManager} from "./socketmanager.mjs";

class LobbyData {
  //impl note
  //  openChallenges is a list of users who submitted an open challenge
  //  privateSenders is a map of users who submitted private challenges to
  //    the users they challenged
  //  privateReceivers is a map of users to a list of users that sent them
  //    private challenges
  //  games is a map from users to a list [opp, game] where [opp] is the
  //  opponent and [game] is a servergame object
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
        receiver: "",
      });
    }
    let privateOpponent = this.privateSenders.get(user);
    if(privateOpponent !== undefined) {
      output.push({
        sender: user,
        receiver: privateOpponent,
      });
    }
    //next check for private challenges going to the user
    for(let sender of this.privateReceivers.get(user)) {
      output.push({
        sender: sender,
        receiver: user,
      });
    }
    //next add all public challenges
    for(let sender of this.openChallenges) {
      if(sender !== user) {
        output.push({
          sender: sender,
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
      let gamedata = new ServerGame(sender, user);
      this.games.set(user, [sender, gamedata]);
      this.games.set(sender, [user, gamedata]);
      return true;
    }
    return false;
  }
  //Returns the ServerGame object representing the current state of the game
  // [user] is taking part in, or undefined if the user is not in a game.
  getGame(user) {
    let output = this.games.get(user);
    if(output) return output[1];
    return undefined;
  }
}

export {LobbyData};

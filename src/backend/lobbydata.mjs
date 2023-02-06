
class LobbyData {
  constructor() {
    this.openChallenges = [];
    this.privateChallenges = [];
    this.games = [];
  }
  gameIndex(user) {
    for(let i = 0; i < this.games.length; i++) {
      if(this.games[i][0] === user || this.games[i][1] === user) return true;
    }
    return false;
  }
  makeOpenChallenge(user) {
    if(this.gameIndex(user) === -1) return false;
    cancelChallenge(user);
    this.openChallenges.push(user);
  }
  makePrivateChallenge(user, opponent) {
    if(this.gameIndex(user) === -1) return false;
    cancelChallenge(user);
    this.privateChallenges.push([user, opponent]);
  }
  cancelChallenge(user) {
    let index = this.openChallenges.indexOf(user);
    if(index !== -1) {
      this.openChallenges.splice(index, 1);
      return;
    }
    for(let i = 0; i < this.privateChallenges.length; i++) {
      if(this.privateChallenges[i][0] === user) {
        this.privateChallenges.splice(i, 1);
        return;
      }
    }
    return;
  }
  attemptJoin(user, opponent) {
    if(this.gameIndex(user) === -1) return false;
    if(this.gameIndex(opponent) === -1) return false;
    for(let i = 0; i < this.privateChallenges.length; i++) {
      let c = this.privateChallenge[i];
      if(c[0] === opponent && c[1] === user) {
        this.privateChallenge.splice(i, 0);
        this.games.push([user, opponent, new ServerGame()]);
        return true;
      }
    }
    let index = this.openChallenges.indexOf(opponent);
    if(index !== -1) {
      this.openChallenges.splice(i, 0);
      this.games.push([user, opponent, new ServerGame()]);
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

import fs from "fs";
import {makeSalt, makeHash} from "./crypto.mjs";
const prefix = "./users/";

function _validateUsernameCharacter(c) {
  return ('0' <= c && c <= '9') 
    || ('a' <= c && c <= 'z') 
    || ('A' <= c && c <= 'Z') 
    || (c === '_');
}

class UserManager {
  constructor(path) {
    this.path = path;
    if(path[path.length - 1] !== '/') this.path += '/';
  }
  _parseFile(username) {
    if(!this.userExists(username)) throw "Exception occurred";
    let output;
    return JSON.parse(fs.readFileSync(this.path + username));
  }
  //require usernames to only contain letters, numbers, underscores
  validUsername(username) {
    if(typeof username !== "string") return false;
    if(username.length === 0) return false;
    for(let i = 0; i < username.length; i++) {
      if(!_validateUsernameCharacter(username[i])) return false;
    }
    return true;
  } 
  userExists(username) {
    if(this.validUsername(username)) {
      return fs.existsSync(this.path + username);
    }
    return false;
  }
  
  //returns true if the username password combo is correct
  authenticate(username, password) {
    if(!this.userExists(username)) return false;
    let userData = this._parseFile(username);
    return makeHash(password + userData.salt) === userData.password;
  }
  
  getElo(username) {
    return this._parseFile(username).elo;
  }
  
  setElo(username, elo) {
    let userData = this._parseFile(username);
    userData.elo = elo;
    fs.writeFileSync(this.path + username, JSON.stringify(userData));
  }
  
  createUser(username, password) {
    if(!this.validUsername(username)) throw "invalid username: " + username;
    if(this.userExists(username)) throw "User " + username + " already exists";
    let salt = makeSalt();
    let s = JSON.stringify({
      username: username,
      salt: salt,
      password: makeHash(password + salt),
      elo: 1000,
    });
    fs.writeFileSync(this.path + username, s);
  }
  
  deleteUser(username, password) {
    if(!this.userExists(username)) throw "User " + username + " does not exist";
    fs.unlink(this.path + username, (err) => {
      if(err) throw err;
    });
  }
}
export {UserManager};

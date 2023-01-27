import fs from "fs";
import {makeSalt, makeHash} from "./crypto.mjs";
const prefix = "./users/";

function _validateUsernameCharacter(c) {
  return ('0' <= c && c <= '9') 
    || ('a' <= c && c <= 'z') 
    || ('A' <= c && c <= 'Z') 
    || (c === '_');
}
//require usernames to only contain letters, numbers, underscores
function _validateUsername(username) {
  if(typeof username !== "string") throw "username must be a string";
  if(username.length === 0) return false;
  for(let i = 0; i < username.length; i++) {
    if(!_validateUsernameCharacter(username[i])) return false;
  }
  return true;
}

function _parseFile(username) {
  if(!userExists(username)) throw "Exception occurred";
  let output;
  return JSON.parse(fs.readFileSync(prefix + username));
}

function userExists(username) {
  if(_validateUsername(username)) return fs.existsSync(prefix + username);
  return false;
}

//returns true if the username password combo is correct
function authenticate(username, password) {
  let userData = _parseFile(username);
  return makeHash(password + userData.salt) === userData.password;
}

function getElo(username) {
  return _parseFile(username).elo;
}

function setElo(username, elo) {
  let userData = _parseFile(username);
  userData.elo = elo;
  fs.writeFileSync(prefix + username, JSON.stringify(userData));
}

function createUser(username, password) {
  if(!_validateUsername(username)) throw "invalid username: " + username;
  if(userExists(username)) throw "User " + username + " already exists";
  let salt = makeSalt();
  let s = JSON.stringify({
    username: username,
    salt: salt,
    password: makeHash(password + salt),
    elo: 1000,
  });
  fs.writeFileSync(prefix + username, s);
}

function deleteUser(username, password) {
  if(!userExists(username)) throw "User " + username + " does not exist";
  fs.unlink(prefix + username, (err) => {
    if(err) throw err;
  });
}

export {userExists, authenticate, getElo, setElo, createUser, deleteUser};

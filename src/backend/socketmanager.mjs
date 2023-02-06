
//literally, a map from usernames to lists of sockets
class SocketManager {
  constructor() {
    this.map = new Map();
  }
  get(user) {
    let output = this.map.get(user);
    if(output === undefined) return [];
    return output;
  }
  add(user, socket) {
    let ls = this.map.get(user);
    if(ls === undefined) {
      this.map.set(user, [socket]);
      return;
    }
    if(ls.indexOf(socket) !== -1) throw "socket already added";
    ls.push(socket);
  }
  remove(user, socket) {
    let ls = this.map.get(user);
    if(ls === undefined) throw "nothing to remove";
    let index = ls.indexOf(socket);
    if(index === -1) throw "cannot remove";
    if(ls.length === 1) this.map.delete(user);
    else ls.splice(index, 1);
  }
}

export {SocketManager};

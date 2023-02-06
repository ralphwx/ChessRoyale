import io from "socket.io-client";

class AuthClient {
    constructor(socket, username) {
    this.socket = socket;
    this.user = username;
  }
  //func is a function that takes username and arguments object
  addEventHandler(eventName, func) {
    this.socket.on(eventName, (args, ack) => {
      func(this.user, args, ack);
    });
  }
  //send an event to the server
  notify(event, data, callback) {
    this.socket.emit(event, data, callback);
  }
}

function connect(url, username, password, create, success, failure) {
  let socket = io(url, {transports:["websocket"]});
  socket.emit("login", username, password, create, (result) => {
    if(result) success(new AuthClient(socket, username));
    else failure();
  });
}

export {connect};

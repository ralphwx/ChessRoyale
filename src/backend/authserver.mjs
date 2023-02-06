
import {UserManager} from "./users.mjs";
import {SocketManager} from "./socketmanager.mjs";
import {Server} from "socket.io";

//wrapper class for socket.io servers that includes login functionality
//to be used alongside AuthClient
class AuthServer {
  //server is an http server
  constructor(server, userpath) {
    this.io = new Server(server);
    this.eventHandlers = [];
    this.users = new UserManager(userpath);
    this.socketmap = new SocketManager();
    this.io.on("connection", (socket) => {
      let user = null;
      for(let eventPair of this.eventHandlers) {
        let [name, code] = eventPair
        socket.on(name, (args, ack) => {
          if(user === null) return;
          code(user, args, ack);
        });
      }
      socket.on("login", (username, password, create, ack) => {
        if(user !== null) ack(false);
        if(create) {
          if(!this.users.validUsername(username) 
            || this.users.userExists(username)) {
            ack(false);
            return;
          }
          this.users.createUser(username, password);
          ack(true);
          user = username;
          this.socketmap.add(user, socket);
          return;
        } else {
          if(this.users.authenticate(username, password)) {
            user = username;
            this.socketmap.add(user, socket);
            ack(true);
          }
          else ack(false);
        }
      });
      socket.on("disconnect", () => {
        if(user !== null) this.socketmap.remove(user, socket);
      });
    });
  }
  //set the function to call when receiving an event
  //func is a function taking username, arguments object, and acknowledgment
  //function
  addEventHandler(eventName, func) {
    this.eventHandlers.push([eventName, func]);
  }
  
  //notifies the user [user] of the event [event] with arguments [data]
  //sends out one notification per socket.
  notify(user, event, data) {
    for(let socket of this.socketmap.get(user)) {
      socket.emit(event, data);
    }
  }
}

export {AuthServer};

import React from "react";
import {Lobby} from "./lobby.js";
import {Game} from "./game.js";
import io from "socket.io-client";

class Manager extends React.Component {
  constructor(props) {
    super(props);
    //this.socket = io("http://18.234.78.8:80", { transports:["websocket"]});
    this.socket = io("localhost:8080", { transports:["websocket"]});
    this.state = {
      display: <Lobby manager={this} socket={this.socket}/>,
    }
  }
  changeState(mode, args) {
    if(mode === "lobby") {
      this.setState({display: <Lobby manager={this} socket={this.socket}/>});
    } else if(mode === "game") {
      this.setState({
        display: <Game manager={this} socket={this.socket} color={args}/>
      });
    } else {
      throw "Incomplete case match: " + mode;
    }
  }
  render() {
    return this.state.display;
  }
}

export {Manager};

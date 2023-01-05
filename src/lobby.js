import React from "react";
import {Game} from "./game.js";
import "./index.css";
class Lobby extends React.Component {
  constructor(props) {
    super(props);
    this.manager = props.manager;
    this.socket = props.socket;
    this.updater = setInterval(() => {
      this.socket.emit("lobby", (data) => {this.updateLobby(data)});
    }, 1000);
    this.state = {
      challenged: false,
    }
    this.socket.removeAllListeners();
    this.socket.on("joined", (color) => {
      this.cancelChallenge();
      clearInterval(this.updater);
      this.manager.changeState("game", color);
    });
    this.socket.on("disconnecting", () => {
      this.socket.emit("cancel", () => {});
    });
  }

  updateLobby(data) {
    let display = [];
    for(const room of data) {
      display.push(
        <div className="roomli" onClick={() => this.joinGame(room.id)}>
          Room {room.id}
        </div>
      );
    }
    if(display.length === 0) {
      display.push(<div className="roomli">{"<No open challenges>"}</div>);
    }
    this.setState({ display: display });
  }

  joinGame(id) {
    this.socket.emit("join", id);
  }

  createChallenge() {
    this.socket.emit("create", () => {
      this.setState({ challenged: true });
    });
  }

  cancelChallenge() {
    this.socket.emit("cancel", () => {
      this.setState({ challenged: false });
    });
  }

  render() {
    let display = "Loading ...";
    if(this.state !== null && this.state.display !== undefined) {
      display = this.state.display;
    }
    let challengeButton;
    if(this.state.challenged) {
      challengeButton = 
        <button onClick={() => this.cancelChallenge()}>
          Cancel
        </button>;
    } else {
      challengeButton = 
        <button onClick={() => this.createChallenge()}>
          Create Challenge
        </button>
    }
    return <div>
      <h1>Lobby</h1>
      <div className="main_display">{display}</div>
      <div className="button_row">
        {challengeButton}
      </div>
    </div>;
  }
}

export {Lobby};

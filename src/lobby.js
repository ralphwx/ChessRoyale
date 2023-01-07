import React from "react";
import {Game} from "./game.js";
import "./index.css";

/**
 * React Component displaying the Lobby.
 */
class Lobby extends React.Component {
  constructor(props) {
    super(props);
    this.manager = props.manager;
    this.socket = props.socket;
    this.socket.removeAllListeners();
    this.lobbyUpdater = setInterval(() => {
      this.socket.emit("lobby", (data) => {
        this.updateLobby(data);
      });
    }, 1000);
    this.state = {
      challenged: false,
    }
    this.socket.on("joined", (color) => {
      this.cancelChallenge();
      clearInterval(this.lobbyUpdater);
      this.manager.changeState("game", color);
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
        <button className="ctrl" onClick={() => this.cancelChallenge()}>
          Cancel
        </button>;
    } else {
      challengeButton = 
        <button className="ctrl" onClick={() => this.createChallenge()}>
          Create Challenge
        </button>
    }
    return <div>
      <h2>My user ID is {this.socket.id}</h2>
      <div className="main_display">{display}</div>
      <div className="button_row">
        {challengeButton}
      </div>
    </div>;
  }
}

export {Lobby};

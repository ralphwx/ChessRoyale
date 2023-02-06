import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import io from "socket.io-client";
import {URL} from "enums.mjs";

/**
 * React Component displaying the Lobby.
 */
class Lobby extends React.Component {
  constructor(props) {
    super(props);
    this.socket = io(URL, { transports:["websocket"] });
    this.lobbyUpdater = setInterval(() => {
      this.socket.emit("lobby", (data) => {
        this.updateLobby(data);
      });
    }, 1000);
    this.state = {
      challenged: false,
      display: "Loading ...",
    }
    this.socket.on("joined", (color) => {
      this.cancelChallenge();
      clearInterval(this.lobbyUpdater);
      alert("game joined, TODO");
      window.location.replace(URL + "/game");
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
      <div className="main_display">{this.state.display}</div>
      <div className="button_row">
        {challengeButton}
      </div>
    </div>;
  }
}

export {Lobby};

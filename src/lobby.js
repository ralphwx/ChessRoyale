import React from "react";
import ReactDOM from "react-dom/client";
import {HeaderRow} from "./header.js";
import {connect} from "./authclient.mjs";
import {URL} from "./enums.mjs";
import "./index.css";

const RowType = {
  OUTGOING_PUBLIC: 0,
  OUTGOING_PRIVATE: 1,
  INCOMING_PRIVATE: 2,
  INCOMING_PUBLIC: 3,
  NO_CHALLENGES: 4,
  LOADING: 5,
}

class LobbyRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      highlight: false,
      challenger: props.challenger,
      challengerElo: props.challengerElo,
      type: props.type,
      opponent: props.opponent,
      onClick: props.onClick,
    }
  }
  hash() {
    if(this.state.type === RowType.NO_CHALLENGES) return 0;
    if(this.state.type === RowType.LOADING) return 1;
    let str = this.state.challenger + "#" + this.state.challengerElo + "#" + 
      this.state.type + "#";
    if(this.state.opponent) str += this.state.opponent;
    let output = 0;
    for(let i = 0; i < str.length; i++) {
      output *= 31;
      output += str.charCodeAt(i);
    }
    console.log("computed hash: " + output);
    return output;
  }
  onMouseEnter() {
    this.setState({highlight:true});
  }
  onMouseExit() {
    this.setState({highlight:false});
  }
  getColor() {
    switch(this.state.type) {
      case RowType.OUTGOING_PRIVATE: return "#1f78b4";
      case RowType.OUTGOING_PUBLIC: return "#a6cee3";
      case RowType.INCOMING_PRIVATE: return "#33a02c";
      case RowType.INCOMING_PUBLIC: return "#b2df8a";
      default: throw "Incomplete case match: " + this.state.type;
    }
  }

  getDescription() {
    switch(this.state.type) {
      case RowType.OUTGOING_PRIVATE: return "Challenging " + this.state.opponent
      case RowType.OUTGOING_PUBLIC: return "Outgoing open challenge";
      case RowType.INCOMING_PRIVATE: return "Private Challenge";
      case RowType.INCOMING_PUBLIC: return "Public Challenge";
      default: throw "Incomplete case match: " + this.state.type;
    }
  }

  getFloaterContent() {
    switch(this.state.type) {
      case RowType.OUTGOING_PRIVATE:
      case RowType.OUTGOING_PUBLIC:
        return "Cancel Challenge";
      case RowType.INCOMING_PRIVATE:
      case RowType.INCOMING_PUBLIC:
        return "Accept Challenge";
      default: throw "Incomplete case match: " + this.state.type;
    }
  }
  render() {
    if(this.state.type === RowType.NO_CHALLENGES) {
      return <div className={"roomli"} style={{
        border: "2px solid lightgray",
      }}>
        <div className="floater">{"<No open challenges>"}</div>
      </div>
    }
    if(this.state.type === RowType.LOADING) {
      return <div className="floater" style={{
        margin: "5px"
      }}>
        {"Loading ..."}
      </div>;
    }
    let color = this.getColor();
    let description = this.getDescription();
    let floaterContent = this.getFloaterContent();
    return <div className="roomli" 
      style={{
        border: "2px solid " + color,
      }}
      onMouseEnter={() => {this.onMouseEnter()}}
      onMouseLeave={() => {this.onMouseExit()}}
      onClick={() => {this.state.onClick()}}
    >
      <div className="descriptor">
        <div style={{float: "left", margin: "2px"}}>
          {this.state.challenger} ({this.state.challengerElo})
        </div>
        <div style={{float: "right", margin: "2px"}}>
          {description}
        </div>
      </div>
      <div className="floater" style={{
        backgroundColor:color,
        opacity: this.state.highlight ? 0.5 : 0.2,
      }}></div>
      <div className="floater" style={{
        opacity: this.state.highlight ? 0.8 : 0,
        margin: "2px",
      }}>
        {floaterContent}
      </div>
    </div>
  }
}
class LobbyView extends React.Component {
  constructor(props) {
    super(props);
    if(localStorage.getItem("username") === null) {
      window.location.replace(URL + "/login");
    }
    connect(URL, 
      JSON.parse(localStorage.getItem("username")),
      JSON.parse(localStorage.getItem("password")), 
      false, (socket) => {
        this.socket = socket;
        this.lobbyUpdater = setInterval(() => {
          this.socket.notify("lobby", null, (data) => {
            this.updateLobby(data);
          });
        }, 1000);
      }, 
      () => {
        window.location.replace(URL + "/login");
      }
    );
    this.state = {
      lobbyData: null,
    }
  }

  updateLobby(data) {
    this.setState({lobbyData: data});
  }
  
  getType(challenge) {
    if(challenge.sender === this.user()) {
      if(challenge.receiver.length === 0) return RowType.OUTGOING_PUBLIC;
      return RowType.OUTGOING_PRIVATE;
    }
    if(challenge.receiver.length === 0) return RowType.INCOMING_PUBLIC;
    return RowType.INCOMING_PRIVATE;
  }
  renderLobby(data) {
    if(data === null) {
      return <LobbyRow key="#loading" type={RowType.LOADING} />
    }
    if(data.length === 0) {
      return <LobbyRow key="#empty" type={RowType.NO_CHALLENGES} />
    }
    let output = [];
    for(let challenge of data) {
      let type = this.getType(challenge)
      output.push(<LobbyRow
        key={challenge.sender}
        challenger={challenge.sender}
        challengerElo={challenge.senderElo}
        type={type}
        opponent={challenge.receiver}
      />);
    }
    return output;
  }

  user() {
    return JSON.parse(localStorage.getItem("username"));
  }

  render() {
    let data = this.state.lobbyData;
    let lobby = this.renderLobby(this.state.lobbyData);
    return <div>
      <HeaderRow />
      <div className="main_display">{lobby}</div>
      <div className="button_row">
        <button className="ctrl">Create open challenge</button>
        <button className="ctrl">Create private challenge</button>
        <button className="ctrl">How to play</button>
      </div>
    </div>
  }
}

class FakeLobbyRow extends React.Component {
  constructor(props) {
    super(props);
    this.text = props.text;
  }
  render() {
    return <div>{this.text}</div>
  }
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<LobbyView />);

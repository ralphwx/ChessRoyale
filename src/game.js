import React from "react";
import ReactDOM from "react-dom/client";
import {connect} from "./authclient.mjs";
import {URL, Color} from "./enums.mjs";
import {BoardView} from "./view.js";
import {ChessBoard} from "./chess.mjs";
import "./index.css";
import {ResourceBar} from "./resourcebar.js";
import {HeaderRow} from "./header.js";

class Game extends React.Component {
  constructor(props) {
    super(props);
    let user = JSON.parse(localStorage.getItem("username"));
    let psw = JSON.parse(localStorage.getItem("password"));
    connect(URL, user, psw, false, (socket) => {
      this.socket = socket;
      this.metaUpdater = setInterval(() => {
        this.socket.notify("gamedata", {}, (data) => {
          if(data.white === user) {
            let stateUpdate = {
              color: Color.WHITE,
              userElo: data.whiteElo,
              opponent: data.black,
              opponentOnline: data.blackOnline,
              opponentElo: data.blackElo,
            }
            this.setState(stateUpdate);
            return;
          }
          if(data.black !== user) throw "Nanitf";
          let stateUpdate = {
            color: Color.BLACK,
            userElo: data.blackElo,
            opponent: data.white,
            opponentOnline: data.whiteOnline,
            opponentElo: data.whiteElo,
          }
          this.setState(stateUpdate);
        });
      }, 1000);
    }, () => {
      window.location.replace(URL + "/login");
    });
    this.state = {
      color: Color.WHITE,
      board: ChessBoard.startingPosition(),
      delay: [],
      user: user,
      userElo: 1000,
      userOnline: true,
      userReady: false,
      opponent: "???",
      opponentElo: "???",
      opponentOnline: false,
      opponentReady: false,
      readyhover: false,
    }
  }
  render() {
    let oppready;
    if(this.state.opponentReady) {
      oppready = <button className="ready online">{"Opponent ready!"}</button>
    } else {
      oppready = <button className="ready offline">
        {"Opponent preparing..."}
      </button>
    }
    let userready;
    if(this.state.userReady) {
      userready = <button className="ready online">{"Ready!"}</button>
    } else if(this.state.readyhover) {
      userready = <button className="ready online"
        onMouseLeave={() => {this.setState({readyhover: false})}}>
        {"Declare ready?"}
      </button>
    } else {
      userready = 
        <button className="ready offline"
          onClick={() => {this.declareReady()}}
          onMouseEnter={() => {this.setState({readyhover: true})}}>
          {"I'm preparing..."}
        </button>
    }
    let userinfo = this.state.userOnline ? "info online" : "info offline";
    let oppoinfo = this.state.opponentOnline ? "info online" : "info offline";
    return <div>
      <HeaderRow />
      <div className="gamecontainer">
        <div>
          <BoardView
            board={ChessBoard.startingPosition()}
            selectRow={-1}
            selectCol={-1}
            onClick={() => {}}
            color={Color.WHITE}
            delay={[]}
          />
          <ResourceBar amount={3.14} />
        </div>
        <div className="metabox">
          <div className={oppoinfo}>
            {this.state.opponent} ({this.state.opponentElo})
          </div>
          {oppready}
          <div className="console"></div>
          {userready}
          <div className={userinfo}>
            {this.state.user} ({this.state.userElo})
          </div>
          <div className="gamectrl"></div>
        </div>
      </div>
    </div>
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

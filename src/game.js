import React from "react";
import ReactDOM from "react-dom/client";
import {connect} from "./authclient.mjs";
import {URL, Color} from "./enums.mjs";
import {BoardView} from "./view.js";
import {ChessBoard} from "./chess.mjs";
import "./index.css";
import {ResourceBar} from "./resourcebar.js";
import {HeaderRow} from "./header.js";
import {HoverButton} from "./hoverbutton.js";
import flag from "./img/flag.png";
import exit from "./img/exit.png";

class Game extends React.Component {
  constructor(props) {
    super(props);
    let user = JSON.parse(localStorage.getItem("username"));
    let psw = JSON.parse(localStorage.getItem("password"));
    connect(URL, user, psw, false, (socket) => {
      this.socket = socket;
      this.socket.addEventHandler("gameover", (user, args) => {
        if(args.ongoing) throw "nanitf";
        let msg;
        if(args.winner === Color.WHITE) msg = "White wins by " + args.cause;
        else if(args.winner === Color.BLACK) msg = "Black wins by " + args.cause
        else throw "Incomplete case match";
        alert(msg);
      });
      this.metaUpdater = setInterval(() => {
        this.socket.notify("gamedata", {}, (data) => {
          console.log("received metadata");
          console.log("ongoing: " + data.ongoing);
          if(data.white === user) {
            let stateUpdate = {
              color: Color.WHITE,
              userElo: data.whiteElo,
              opponent: data.black,
              opponentOnline: data.blackOnline,
              opponentElo: data.blackElo,
              ongoing: data.ongoing,
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
            ongoing: data.ongoing,
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
      ongoing: true,
    }
  }
  offerDraw() {
    console.log("draw offer");
  }
  resign() {
    this.socket.notify("resign", {}, () => {});
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
    } else {
      userready = <HoverButton
        innerHTML={"I'm preparing..."}
        innerHTMLHover={"Declare ready?"}
        className={"ready offline"}
        classNameHover={"ready online"}
        onClick={() => {console.log("declare ready");}}
      />
    }
    let userinfo = this.state.userOnline ? "info online" : "info offline";
    let oppoinfo = this.state.opponentOnline ? "info online" : "info offline";
    console.log(this.state.ongoing);
    let resign = <HoverButton
      key="exit"
      innerHTML={<img className="chesspiece" src={exit} alt="leave"/>}
      innerHTMLHover={<img className="chesspiece" src={exit} alt="leave"/>}
      className={"resign"}
      classNameHover={"resign resignhover"}
      onClick={() => {window.location.replace(URL)}}
    />
    if(this.state.ongoing) {
      console.log("button replace!");
      resign = <HoverButton
        key="resign"
        innerHTML={<img className="chesspiece" src={flag} alt="resign"/>}
        innerHTMLHover={<img className="chesspiece" src={flag} alt="leave"/>}
        className={"resign"}
        classNameHover={"resign resignhover"}
        onClick={() => {this.resign()}}
      />
    }
    return <div>
      <HeaderRow />
      <div className="gamecontainer">
        <div>
          <BoardView
            board={ChessBoard.startingPosition()}
            selectRow={-1}
            selectCol={-1}
            onClick={() => {}}
            color={this.state.color}
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
          <div className="gamectrl">
            <HoverButton
              innerHTML={"1/2"}
              innerHTMLHover={"1/2"}
              className={"draw"}
              classNameHover={"draw drawhover"}
              onClick={() => {this.offerDraw()}}
            />
            {resign}
          </div>
        </div>
      </div>
    </div>
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

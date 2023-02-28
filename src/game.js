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
import abort from "./img/abort.png";

const resource_time = 4000;
const max_resources = 10;
const move_delay = 2000;

class Game extends React.Component {
  constructor(props) {
    super(props);
    let user = JSON.parse(localStorage.getItem("username"));
    let psw = JSON.parse(localStorage.getItem("password"));
    connect(URL, user, psw, false, (socket) => {
      this.socket = socket;
      this.socket.notify("redirect?", {}, (place) => {
        if(place === "game") return;
        if(place === "lobby") {
          window.location.replace(URL);
          return;
        }
        throw "Incomplete case match: " + place;
      });
      this.socket.addEventHandler("started", (user, args) => {
        this.setState({startTime: args.time});
      });
      this.socket.addEventHandler("gameover", (user, args) => {
        if(args.ongoing) throw "nanitf";
        let msg;
        if(args.winner === Color.WHITE) msg = "White wins by " + args.cause;
        else if(args.winner === Color.BLACK) msg = "Black wins by " + args.cause
        else if(args.winner === Color.NONE) {
          if(args.cause === "aborted") msg = "Game aborted";
          else msg = "Draw agreed";
        }
        else throw "Incomplete case match";
        alert(msg);
        this.state.console.push(msg);
        this.setState({});
      });
      function metaUpdate(caller) {
        caller.socket.notify("gamedata", {}, (data) => {
          if(data.white === user) {
            let stateUpdate = {
              color: Color.WHITE,
              userElo: data.whiteElo,
              userReady: data.wready,
              opponent: data.black,
              opponentOnline: data.blackOnline,
              opponentElo: data.blackElo,
              opponentReady: data.bready,
              ongoing: data.ongoing,
            }
            if(!caller.state.drawOffered) {
              if(data.wdraw && !data.bdraw) {
                caller.state.console.push("Draw offer sent");
                stateUpdate.drawOffered = true;
              }
              if(data.bdraw && !data.wdraw) {
                caller.state.console.push("Opponent offers a draw");
                stateUpdate.drawOffered = true;
              }
            }
            caller.setState(stateUpdate);
            return;
          }
          if(data.black !== user) throw "Nanitf";
          let stateUpdate = {
            color: Color.BLACK,
            userElo: data.blackElo,
            userReady: data.bready,
            opponent: data.white,
            opponentOnline: data.whiteOnline,
            opponentElo: data.whiteElo,
            opponentReady: data.wready,
            ongoing: data.ongoing,
          }
          if(!caller.state.drawOffered) {
            if(data.wdraw && !data.bdraw) {
              caller.state.console.push("Opponent offers a draw");
              stateUpdate.drawOffered = true;
            }
            if(data.bdraw && !data.wdraw) {
              caller.state.console.push("Draw offer sent");
              stateUpdate.drawOffered = true;
            }
          }
          caller.setState(stateUpdate);
        });
      }
      metaUpdate(this);
      this.metaUpdater = setInterval(metaUpdate, 1000, this);
      this.resourceUpdater = setInterval(() => {
        if(this.state.ongoing === false) return;
        let now = Date.now();
        if(now - this.state.startTime > resource_time * max_resources) {
          this.setState({startTime: now - resource_time * max_resources});
        } else this.setState({});
      }, 100);
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
      console: ["Good luck have fun!", "Click 'I'm preparing' down below to declare yourself ready; game starts when both players are ready."],
    }
  }

  offerDraw() {
    this.socket.notify("draw", {}, () => {});
  }

  resign() {
    this.socket.notify("resign", {}, () => {});
  }

  abort() {
    this.socket.notify("abort", {}, () => {});
  }

  declareReady() {
    this.socket.notify("ready", {}, () => {});
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
        onClick={() => {this.declareReady()}}
      />
    }
    let userinfo = this.state.userOnline ? "info online" : "info offline";
    let oppoinfo = this.state.opponentOnline ? "info online" : "info offline";
    let resign = <HoverButton
      key="exit"
      innerHTML={<img className="chesspiece" src={exit} alt="leave"/>}
      innerHTMLHover={<img className="chesspiece" src={exit} alt="leave"/>}
      className={"resign"}
      classNameHover={"resign resignhover"}
      onClick={() => {window.location.replace(URL)}}
    />
    if(this.state.ongoing) {
      resign = <HoverButton
        key="resign"
        innerHTML={<img className="chesspiece" src={flag} alt="resign"/>}
        innerHTMLHover={<img className="chesspiece" src={flag} alt="resign"/>}
        className={"resign"}
        classNameHover={"resign resignhover"}
        onClick={() => {this.resign()}}
      />
      if(!this.state.userReady || !this.state.opponentReady) {
        resign = <HoverButton
          key="abort"
          innerHTML={<img className="chesspiece" src={abort} alt="abort"/>}
          innerHTMLHover={<img className="chesspiece" src={abort} alt="abort"/>}
          className={"resign"}
          classNameHover={"resign resignhover"}
          onClick={() => {this.abort()}}
        />
      }
    }
    let amount = (Date.now() - this.state.startTime) / resource_time;
    let console_text = []
    for(let t of this.state.console) console_text.push(<div>{t}<br/></div>);
    if(!this.state.ongoing) amount = 0;
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
          <ResourceBar amount={amount} />
        </div>
        <div className="metabox">
          <div className={oppoinfo}>
            {this.state.opponent} ({this.state.opponentElo})
          </div>
          {oppready}
          <div className="console">
            <div style={{margin: "5px"}}>{console_text}</div>
          </div>
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

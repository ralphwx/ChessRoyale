import React from "react";
import {Lobby} from "./lobby.js";
import {BoardView} from "./view.js";
import {ChessBoard, Piece} from "./chess.js";
import {ResourceBar} from "./resourcebar.js";

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.manager = props.manager;
    this.socket = props.socket;
    this.state = {
      board: ChessBoard.startingPosition(),
      selectRow: -1,
      selectCol: -1,
      ready:false,
    }
    this.color = props.color;
    this.started = false;

    this.socket.removeAllListeners();
    this.socket.on("board", (state) => {
      this.setState({ board: ChessBoard.fromString(state) });
    });
    this.socket.on("started", (time) => {
      this.started = true;
      this.setState({ baseTime: time });
      this.barUpdater = setInterval(() => {
        let now = Date.now();
        if(now - this.state.baseTime > 30000) {
          this.setState({ baseTime: now - 30000 });
        } else this.setState({});
      }, 100);
    });
  }

  leaveGame() {
    if(this.barUpdater !== undefined) {
      clearInterval(this.barUpdater);
    }
    this.socket.emit("leave");
    this.manager.changeState("lobby");
  }

  increaseCount() {
    this.setState({count: this.state.count + 1});
  }

  declareReady() {
    this.socket.emit("ready", () => {
      this.setState({ ready: true });
    });
  }

  onClick(i, j) {
    if(this.state.selectRow === -1) {
      if(this.state.board.pieceAt(i, j) !== Piece.NULL) {
        this.setState({
          selectRow: i,
          selectCol: j,
        });
      }
    } else {
      if(Date.now() - this.state.baseTime < 3000) return;
      this.socket.emit("move", [this.state.selectRow, this.state.selectCol,
        i, j], () => {
          this.setState({ baseTime: this.state.baseTime + 3000 });
      });
      this.setState({
        selectRow: -1,
        selectCol: -1,
      });
    }
  }

  render() {
    let amount = this.started ? (Date.now() - this.state.baseTime) / 3000 : 0;
    let readyButton;
    if(this.state.ready) {
      readyButton = <button>Ready!</button>
    } else {
      readyButton = <button onClick={() => {this.declareReady()}}>Start</button>
    }
    return <div>
      <h1>Game</h1>
      <BoardView
        board={this.state.board}
        selectRow={this.state.selectRow}
        selectCol={this.state.selectCol}
        onClick={(i, j) => {this.onClick(i, j)}}
        color={this.color}
      />
      <ResourceBar amount={amount}/>
      <button onClick={() => {this.leaveGame()}}>Leave</button>
      {readyButton}
    </div>;
  }
}

export {Game};

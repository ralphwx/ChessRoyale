
import React from "react";
import {ChessBoard, Piece} from "./chess.js";
import io from "socket.io-client";
import {BoardView} from "./view.js";
import {ResourceBar} from "./resourcebar.js";

export class Controller extends React.Component {
  //controller needs to interact with the socketio server
  constructor(props) {
    super(props);
    this.socket = io(props.ip + ":" + props.port, { transports: ["websocket"]});
    this.socket.on("connect", () => {
      console.log("Client connected");
    });
    this.socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
    this.socket.on("init", (data) => {
      this.state.board = ChessBoard.fromString(data.board);
      console.log("Initialized state");
    });
    this.socket.on("pong", () => {
      this.lastPong = Date.now();
    });
    this.socket.on("moved", () => {
      this.state.baseTime += 3000;
    });
    this.socket.on("board", (board) => {
      console.log("received board update");
      this.setState({
        board: ChessBoard.fromString(board),
        selectRow: this.state.selectRow,
        selectCol: this.state.selectCol,
      });
    });
    this.state = {
      board: ChessBoard.startingPosition(),
      selectRow: -1,
      selectCol: -1,
      baseTime: Date.now(),
    }
    this.socket.emit("init", (data) => {
      let board = ChessBoard.fromString(data.board);
      this.setState({
        board: board,
        selectRow: this.state.selectRow,
        selectCol: this.state.selectCol,
        baseTime: this.state.baseTime,
      });
    });
    this.resourceBarUpdater = setInterval(() => {
      let now = Date.now();
      if(now - this.state.baseTime > 30000) this.state.baseTime = now - 30000;
      this.setState(this.state);
    });
  }
  onClick(i, j) {
    //if nothing is selected and a piece is clicked, then select that piece
    //else if something is already selected, then attempt to move the selected
    //piece
    //the Java version has a more advanced UI but we can improve this later
    if(this.state.selectRow == -1) {
      if(this.state.board.pieceAt(i, j) !== Piece.NULL) {
        this.setState({
          board: this.state.board,
          selectRow: i,
          selectCol: j,
        });
      }
    } else {
      if(Date.now() - this.state.baseTime < 3000) return;
      this.socket.emit("move", [this.state.selectRow, this.state.selectCol, 
        i, j]);
      this.setState({
        board: this.state.board,
        selectRow: -1,
        selectCol: -1,
      });
    }
  }
  render() {
    let amount = (Date.now() - this.state.baseTime) / 3000;
    return <div>
      <BoardView 
        board={this.state.board} 
        selectRow={this.state.selectRow} 
        selectCol={this.state.selectCol}
        onClick={(i, j) => {this.onClick(i, j)}}
      />
      <ResourceBar amount={amount}/>
    </div>
  }
}

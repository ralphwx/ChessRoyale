
import React from "react";
import {ChessBoard, Piece} from "./chess.js";
import io from "socket.io-client";
import {BoardView} from "./view.js";

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
    this.socket.on("board", (board) => {
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
    }
    this.socket.emit("init", (data) => {
      let board = ChessBoard.fromString(data.board);
      this.setState({
        board: board,
        selectRow: this.state.selectRow,
        selectCol: this.state.selectCol,
      });
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
    return <BoardView 
      board={this.state.board} 
      selectRow={this.state.selectRow} 
      selectCol={this.state.selectCol}
      onClick={(i, j) => {this.onClick(i, j)}}
    />
  }
}

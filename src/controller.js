
import {ChessBoard, Piece} from "./chess.js";
import io from "socket.io-client";
import {BoardView} from "./view.js";

class Controller {
  //controller needs to interact with the socketio server
  constructor(ip, port) {
    this.lastPong;
    this.socket = io(ip + ":" + port, { transports: ["websocket"]});
    this.socket.on("connect", () => {
      console.log("Client connected");
    }
    this.socket.on("disconnect", () => {
      console.log("Client disconnected");
    }
    this.socket.on("pong" () => {
      this.lastPong = Date.now();
    }
    this.socket.on("board", board) {
      //update the view
    }
    this.selectRow = -1;
    this.selectCol = -1;
    this.board = ChessBoard.startingPosition();
    this.socket.emit("board");
    this.view = <BoardView board={this.board} selectRow={-1} selectCol={-1}/>;
  }
  onClick(i, j) {
    
  }
}

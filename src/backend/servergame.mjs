
import {ChessBoard} from "../chess.mjs";
import {Piece, Color, colorOf, MoveType} from "../enums.mjs";

class ServerGame {
  constructor() {
    //ServerGame tracks the board state, everyone who needs board updates,
    //who's ready
    this.board = ChessBoard.startingPosition();
    this.listeners = [];
    this.wready = false;
    this.bready = false;
  }

  boardState() {
    return this.board.toString();
  }

  setReady(color) {
    if(color === Color.BLACK) this.bready = true;
    else if(color === Color.WHITE) this.wready = true;
    else throw "Incomplete case match " + color;
  }

  bothReady() {
    return this.bready && this.wready;
  }

  move(iRow, iCol, fRow, fCol, color) {
    if(this.gameOver().gameOver) return false;
    if(!this.bothReady()) return false;
    if(this.board.moveType(iRow, iCol, fRow, fCol) !== MoveType.INVALID
      && colorOf(this.board.pieceAt(iRow, iCol)) === color) {
      this.board.move(iRow, iCol, fRow, fCol);
      return true;
    }
    return false;
  }

  addListener(socket) {
    this.listeners.push(socket);
  }

  removeListener(socket) {
    let index = this.listeners.indexOf(socket);
    if(index !== -1) this.listeners.splice(index, 1);
  }

  getListeners() {
    return this.listeners;
  }

  gameOver() {
    let wking = false;
    let bking = false;
    for(let i = 0; i < 8; i++) {
      for(let j = 0; j < 8; j++) {
        if(this.board.pieceAt(i, j) === Piece.W_KING) wking = true;
        if(this.board.pieceAt(i, j) === Piece.B_KING) bking = true;
      }
    }
    return {
      gameOver: !wking || !bking,
      winner: wking
    }
  }
}

export {ServerGame};

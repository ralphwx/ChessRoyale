
const {ChessBoard, Piece} = require("../chess.js");
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
    if(color === "black") this.bready = true;
    else if(color === "white") this.wready = true;
    else throw "Incomplete case match " + color;
  }

  bothReady() {
    return this.bready && this.wready;
  }

  //color is true for white, false for black
  move(iRow, iCol, fRow, fCol, color) {
    if(this.gameOver().gameOver) return false;
    if(!this.bothReady()) return false;
    if(this.board.validMove(iRow, iCol, fRow, fCol) 
      && this.board.pieceAt(iRow, iCol) >= Piece.B_PAWN !== color) {
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

module.exports.ServerGame = ServerGame;

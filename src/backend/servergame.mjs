
import {ChessBoard} from "../chess.mjs";
import {Piece, Color, colorOf, MoveType} from "../enums.mjs";

//ServerGame keeps track of the data relevant to a single game
//it tracks the username of the person playing white and black, tracks
//who's ready, and tracks whether the game is over.
class ServerGame {
  constructor(whiteUser, blackUser) {
    //ServerGame tracks the board state, everyone who needs board updates,
    //who's ready
    this.board = ChessBoard.startingPosition();
    this.white = whiteUser;
    this.black = blackUser;
    this.wready = false;
    this.bready = false;
  }

  metaData() {
    return {
      white: this.white,
      black: this.black,
      wready: this.wready,
      bready: this.bready,
    }
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

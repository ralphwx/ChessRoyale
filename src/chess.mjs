
import {Piece, Color, colorOf, MoveType} from "./enums.mjs";

//8x8 board of Pieces
class Board {
  //constructs an empty board
  constructor() {
    this.data = [];
    for(let i = 0; i < 8; i++) {
      let arr = [];
      for(let j = 0; j < 8; j++) {
        arr.push(Piece.NULL);
      }
      this.data.push(arr);
    }
  }
  pieceAt(r, c) {
    this.assertBounds(r, c);
    return this.data[r][c];
  }
  setPieceAt(r, c, p) {
    this.assertBounds(r, c, p);
    this.data[r][c] = p;
  }
  assertBounds(r, c, p=0) {
    if(r < 0 || r > 7 || c < 0 || c > 7) {
      console.trace();
      throw "Index out of bounds. Row " + r + ", Col " + c;
    }
    if(p < 0 || p > 12) {
      throw "Illegal piece index " + p;
    }
  }
}

/**
 * Representation of a chess board, with its pieces and game state.
 * By convention, row 0 is the first rank, row 7 is the eigth rank. Col 0 is
 * the a-file, col 7 is the h-file. Client classes should not use the
 * constructor, but instead use either ChessBoard.startingPosition() or
 * ChessBoard.fromString() to construct chessboard instances.
 */
class ChessBoard {
  /**
   * Constructs an empty chess board.
   *
   */
  constructor() {
    this.board = new Board();
    this.wkcastle = true;
    this.wqcastle = true;
    this.bkcastle = true;
    this.bqcastle = true;
  }
  /**
   * Returns a string representation of this object, which can then be used to
   * reconstruct this object with ChessBoard.fromString();
   * Guaranteed that ChessBoard.fromString(this.toString()) will be a deep copy
   * of [this].
   */
  toString() {
    let output = []
    output.push(" ");
    output.push(" ");
    output.push(this.wkcastle ? "1" : "0");
    output.push(this.wqcastle ? "1" : "0");
    output.push(this.bkcastle ? "1" : "0");
    output.push(this.bqcastle ? "1" : "0");
    for(let r = 0; r < 8; r++) {
      for(let c = 0; c < 8; c++) {
        output.push(this.board.pieceAt(r, c).toString(16));
      }
    }
    return output.join("");
  }
  /**
   * Constructs and returns a new ChessBoard object from the string
   * representation [str].
   */
  static fromString(str) {
    let output = new ChessBoard();
    output.wkcastle = output[2] === "1";
    output.wqcastle = output[3] === "1";
    output.bkcastle = output[4] === "1";
    output.bqcastle = output[5] === "1";
    for(let i = 0; i < 8; i++) {
      for(let j = 0; j < 8; j++) {
        output.board.setPieceAt(i, j, parseInt(str.charAt(8 * i + j + 6), 16));
      }
    }
    return output;
  }
  /**
   * Constructs and returns a new ChessBoard object, initialized to the starting
   * position.
   */
  static startingPosition() {
    let output = new ChessBoard();
    output.board.setPieceAt(0, 0, Piece.W_ROOK);
    output.board.setPieceAt(0, 1, Piece.W_KNIGHT);
    output.board.setPieceAt(0, 2, Piece.W_BISHOP);
    output.board.setPieceAt(0, 3, Piece.W_QUEEN);
    output.board.setPieceAt(0, 4, Piece.W_KING);
    output.board.setPieceAt(0, 5, Piece.W_BISHOP);
    output.board.setPieceAt(0, 6, Piece.W_KNIGHT);
    output.board.setPieceAt(0, 7, Piece.W_ROOK);
    for(let i = 0; i < 8; i++) {
      output.board.setPieceAt(1, i, Piece.W_PAWN);
      output.board.setPieceAt(6, i, Piece.B_PAWN);
    }
    output.board.setPieceAt(7, 0, Piece.B_ROOK);
    output.board.setPieceAt(7, 1, Piece.B_KNIGHT);
    output.board.setPieceAt(7, 2, Piece.B_BISHOP);
    output.board.setPieceAt(7, 3, Piece.B_QUEEN);
    output.board.setPieceAt(7, 4, Piece.B_KING);
    output.board.setPieceAt(7, 5, Piece.B_BISHOP);
    output.board.setPieceAt(7, 6, Piece.B_KNIGHT);
    output.board.setPieceAt(7, 7, Piece.B_ROOK);
    return output;
  }
  /**
   * Considers the move from [iRow, iCol] to [fRow, fCol] and returns its
   * MoveType.
   */
  moveType(iRow, iCol, fRow, fCol) {
    this.board.assertBounds(iRow, iCol);
    this.board.assertBounds(fRow, fCol);
    let iColor = colorOf(this.pieceAt(iRow, iCol));
    let fColor = colorOf(this.pieceAt(fRow, fCol));
    //cannot capture your own piece
    if(iColor === fColor) return MoveType.INVALID;
    let step = this.getDirection(iRow, iCol, fRow, fCol);
    let pathCheck = this.checkPath(iRow, iCol, fRow, fCol);
    switch(this.pieceAt(iRow, iCol)) {
      case Piece.NULL:
        return MoveType.INVALID; //cannot move empty square
      case Piece.W_ROOK:
      case Piece.B_ROOK:
        if(step === null || step[0] * step[1] || !pathCheck) {
          return MoveType.INVALID;
        } else if(fColor !== Color.NONE) return MoveType.CAPTURE;
        else return MoveType.MOVE;
      case Piece.W_BISHOP:
      case Piece.B_BISHOP:
        if(step === null || step[0] * step[1] === 0 || !pathCheck) {
          return MoveType.INVALID;
        } else if(fColor !== Color.NONE) return MoveType.CAPTURE;
        else return MoveType.MOVE;
      case Piece.W_QUEEN:
      case Piece.B_QUEEN:
        if(step === null || !pathCheck) return MoveType.INVALID;
        else if(fColor !== Color.NONE) return MoveType.CAPTURE;
        else return MoveType.MOVE;
      case Piece.W_KING:
        if(iRow === 0 && fRow === 0 && fCol >= 6) {
          if(this.wkcastle
            && this.pieceAt(0, 5) === Piece.NULL 
            && this.pieceAt(0, 6) === Piece.NULL
            && this.pieceAt(0, 7) === Piece.W_ROOK
            && !this.isAttacked(0, 4, Color.BLACK)
            && !this.isAttacked(0, 5, Color.BLACK)) {
            return MoveType.CASTLE;
          }
          return MoveType.INVALID;
        }
        if(iRow === 0 && fRow === 0 && fCol <= 2) {
          if(this.wqcastle
            && this.pieceAt(0, 3) === Piece.NULL
            && this.pieceAt(0, 2) === Piece.NULL
            && this.pieceAt(0, 1) === Piece.NULL
            && this.piece(0, 0) === Piece.W_ROOK
            && !this.isAttacked(0, 4, Color.BLACK)
            && !this.isAttacked(0, 3, Color.BLACK)) {
            return MoveType.CASTLE;
          }
          return MoveType.INVALID;
        }
      case Piece.B_KING:
        if(iRow === 7 && fRow === 7 && fCol >= 6) {
          if(this.bkcastle
            && this.pieceAt(7, 5) === Piece.NULL
            && this.pieceAt(7, 6) === Piece.NULL
            && this.pieceAt(7, 7) === Piece.B_ROOK
            && !this.isAttacked(7, 4, Color.WHITE)
            && !this.isAttacked(7, 5, Color.WHITE)) {
            return MoveType.CASTLE;
          }
          return MoveType.INVALID;
        }
        if(iRow === 7 && fRow === 7 && fCol <= 2) {
          if(this.bqcastle
            && this.pieceAt(7, 3) === Piece.NULL
            && this.pieceAt(7, 2) === Piece.NULL
            && this.pieceAt(7, 1) === Piece.NULL
            && this.pieceAt(7, 0) === Piece.B_ROOK
            && !this.isAttacked(7, 4, Color.WHITE)
            && !this.isAttacked(7, 3, Color.WHITE)) {
            return MoveType.CASTLE;
          }
          return MoveType.INVALID;
        }
        if(step === null || fRow !== iRow + step[0] || fCol !== iCol + step[1]){
          return MoveType.INVALID;
        } else if(fColor !== Color.NULL) return MoveType.CAPTURE;
        else return MoveType.MOVE;
      case Piece.W_KNIGHT:
      case Piece.B_KNIGHT:
        if(step !== null 
          || Math.abs(fRow - iRow) + Math.abs(fCol - iCol) !== 3) {
          return MoveType.INVALID;
        } else if(fColor !== Color.NULL) return MoveType.CAPTURE;
        else return MoveType.MOVE;
      case Piece.W_PAWN:
        if(fCol === iCol) {
          if(fRow === iRow + 1 || (iRow === 1 && fRow === 3)) {
            if(fRow === 7) return MoveType.PROMOTION;
            return MoveType.MOVE;
          } 
          return MoveType.INVALID;
        }
        //assert target is black and it's only one step away
        if(fColor === Color.BLACK
          && step !== null 
          && fRow === iRow + 1 
          && fCol === iCol + step[1]) {
          if(fRow === 7) return MoveType.PROMOTION;
          return MoveType.CAPTURE;
        } else return MoveType.INVALID;
      case Piece.B_PAWN:
        if(fCol === iCol) {
          if(fRow === iRow - 1 || (iRow === 6 && fRow === 4)) {
            if(fRow === 0) return MoveType.PROMOTION;
            return MoveType.MOVE;
          }
          return MoveType.INVALID;
        }
        if(fColor === Color.WHITE
          && step !== null 
          && fRow === iRow - 1 
          && fCol === iCol + step[1]) {
          if(fRow === 0) return MoveType.PROMOTION;
          return MoveType.CAPTURE;
        }
        return MoveType.INVALID;
      default:
        throw "Incomplete case match";
    }
  }
  /**
   * Attempts to modify this ChessBoard by making the move that puts the piece
   * on [iRow, iCol] to [fRow, fCol]. If the move is invalid, nothing happens.
   */
  move(iRow, iCol, fRow, fCol) {
    let movetype = this.moveType(iRow, iCol, fRow, fCol);
    if(movetype === MoveType.INVALID) return;
    if((iRow === 0 && iCol === 0) || (fRow === 0 && fCol === 0)) {
      this.wqcastle = false;
    }
    if((iRow === 0 && iCol === 7) || (fRow === 0 && fCol === 7)) {
      this.wkcastle = false;
    }
    if((iRow === 7 && iCol === 0) || (fRow === 7 && iCol === 0)) {
      this.bqcastle = false;
    }
    if((iRow === 7 && iCol === 7) || (fRow === 7 && iCol === 7)) {
      this.bkcastle = false;
    }
    if(iRow === 0 && iCol === 4) {
      this.wkcastle = false;
      this.wqcastle = false;
    }
    if(iRow === 7 && iCol === 4) {
      this.bkcastle = false;
      this.bqcastle = false;
    }
    switch(movetype) {
      case MoveType.INVALID: 
        console.log("invalid move");
        return;
      case MoveType.CASTLE:
        if(iRow === 0) {
            this.wkcastle = false;
            this.wqcastle = false;
            this.board.setPieceAt(0, 4, Piece.NULL);
          if(fCol > iCol) {
            this.board.setPieceAt(0, 5, Piece.W_ROOK);
            this.board.setPieceAt(0, 6, Piece.W_KING);
            this.board.setPieceAt(0, 7, Piece.NULL);
            return;
          } else {
            this.board.setPieceAt(0, 3, Piece.W_ROOK);
            this.board.setPieceAt(0, 2, Piece.W_KING);
            this.board.setPieceAt(0, 0, Piece.NULL);
            return;
          }
        } else {
          this.bkcastle = false;
          this.bqcastle = false;
          this.board.setPieceAt(7, 4, Piece.NULL);
          if(fCol > iCol) {
            this.board.setPieceAt(7, 5, Piece.B_ROOK);
            this.board.setPieceAt(7, 6, Piece.B_KING);
            this.board.setPieceAt(7, 7, Piece.NULL);
            return;
          } else {
            this.board.setPieceAt(7, 3, Piece.B_ROOK);
            this.board.setPieceAt(7, 2, Piece.B_KING);
            this.board.setPieceAt(7, 0, Piece.NULL);
	    return;
          }
        }
      case MoveType.PROMOTION:
        if(fRow === 7) {
          this.board.setPieceAt(fRow, fCol, Piece.W_QUEEN);
          this.board.setPieceAt(iRow, iCol, Piece.NULL);
          return;
        } else {
          this.board.setPieceAt(fRow, fCol, Piece.B_QUEEN);
          this.board.setPieceAt(iRow, iCol, Piece.NULL);
          return;
        }
      case MoveType.MOVE:
      case MoveType.CAPTURE:
        this.board.setPieceAt(fRow, fCol, this.board.pieceAt(iRow, iCol));
        this.board.setPieceAt(iRow, iCol, Piece.NULL);
        return;
      default: throw "Incomplete case match: " + movetype;
    }
  }
  /**
   * Returns a pair [x, y] where [x] and [y] are one of {1, 0, -1}, and there
   * exists a positive integer n such that fRow === iRow + nx and
   * fCol === iCol + ny. If no such [x, y] exist, then returns null. If
   * [iRow, iCol] === [fRow, fCol] then behavior is undefined.
   * Helper function for ChessBoard.moveType.
   */
  getDirection(iRow, iCol, fRow, fCol) {
    let dx = fRow - iRow;
    let dy = fCol - iCol;
    if(dx === 0) {
      if(dy > 0) return [0, 1];
      else return [0, -1];
    }
    if(dy === 0) {
      if(dx > 0) return [1, 0];
      else return [-1, 0];
    }
    if(dx === dy) {
      if(dx > 0) return [1, 1];
      else return [-1, -1];
    }
    if(dx === -dy) {
      if(dx > 0) return [1, -1];
      else return [-1, 1];
    }
    return null;
  }
  /**
   * returns whether any pieces of color [color] attack the square [r, c].
   * Helper function for ChessBoard.moveType
   */
  isAttacked(r, c, color) {
    for(let i = 0; i < 8; i++) {
      for(let j = 0; j < 8; j++) {
        if(colorOf(this.pieceAt(i, j)) === color
          && this.moveType(i, j, r, c) !== MoveType.INVALID) return true;
      }
    }
    return false;
  }
  /**
   * Checks the path from [iRow, iCol] to [fRow, fCol], returns true if there
   * are no pieces between [iRow, iCol] and [fRow, fCol], exclusive of the
   * endpoints.
   * 
   * Helper function for ChessBoard.moveType
   */
  checkPath(iRow, iCol, fRow, fCol) {
    let step = this.getDirection(iRow, iCol, fRow, fCol);
    if(step === null) return false;
    let r = iRow + step[0];
    let c = iCol + step[1];
    while(r !== fRow || c !== fCol) {
      if(this.pieceAt(r, c) !== Piece.NULL) return false;
      r += step[0];
      c += step[1];
    }
    return true;
  }
  /**
   * Returns the piece at [r, c].
   */
  pieceAt(r, c) {
    return this.board.pieceAt(r, c);
  }
}

export {ChessBoard};

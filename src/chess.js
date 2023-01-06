
var Piece = {
  NULL: 0,
  W_PAWN: 1,
  W_ROOK: 2,
  W_KNIGHT: 3,
  W_BISHOP: 4,
  W_QUEEN: 5,
  W_KING: 6,
  B_PAWN: 7,
  B_ROOK: 8,
  B_KNIGHT: 9,
  B_BISHOP: 10,
  B_QUEEN: 11,
  B_KING: 12,
}

//8x8 board of pieces.
class Board {
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
  //returns the piece at row r and column c. ' ' represents an empty square,
  //k for king, q for queen, b for bishop, n for knight, r for rook, p for
  //pawn, captial letter for white pieces, lowercase letter for black pieces
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

class ChessBoard {
  //convention: row 0 corresponds to the first rank, row 7 corresponds to the
  //eigth rank. col 0 corresponds to the a-file, col 7 corresponds to the h-file
  //constructs an empty chess board. Client classes should use either
  //ChessBoard.fromString() or ChessBoard.startingPosition().
  constructor() {
    this.board = new Board();
    this.wkcastle = true;
    this.wqcastle = true;
    this.bkcastle = true;
    this.bqcastle = true;
  }
  toString() {
    let output = []
    for(let r = 0; r < 8; r++) {
      for(let c = 0; c < 8; c++) {
        output.push(this.board.pieceAt(r, c).toString(16));
      }
    }
    return output.join("");
  }
  static fromString(str) {
    let output = new ChessBoard();
    if(str.length != 64) throw "Incorrect string length, " + str.length;
    for(let i = 0; i < 8; i++) {
      for(let j = 0; j < 8; j++) {
        output.board.setPieceAt(i, j, parseInt(str.charAt(8 * i + j), 16));
      }
    }
    return output;
  }
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
  validMove(iRow, iCol, fRow, fCol) {
    this.board.assertBounds(iRow, iCol);
    this.board.assertBounds(fRow, fCol);
    let black = this.pieceAt(iRow, iCol) >= Piece.B_PAWN;
    let tblack = this.pieceAt(fRow, fCol) >= Piece.B_PAWN;
    //cannot capture your own piece
    if(this.pieceAt(fRow, fCol) != Piece.NULL && black === tblack) return false;
    let step = this.getDirection(iRow, iCol, fRow, fCol);
    let pathCheck = this.checkPath(iRow, iCol, fRow, fCol);
    switch(this.pieceAt(iRow, iCol)) {
      case Piece.NULL:
        return false;
      case Piece.W_ROOK:
      case Piece.B_ROOK:
        return step !== null && step[0] * step[1] === 0 && pathCheck;
      case Piece.W_BISHOP:
      case Piece.B_BISHOP:
        return step !== null && step[0] * step[1] !== 0 && pathCheck;
      case Piece.W_QUEEN:
      case Piece.B_QUEEN:
        return step !== null && pathCheck;
      case Piece.W_KING:
        if(iRow === 0 && fRow === 0 && fCol >= 6) {
          return this.wkcastle
            && this.pieceAt(0, 5) === Piece.NULL 
            && this.pieceAt(0, 6) === Piece.NULL
            && this.pieceAt(0, 7) === Piece.W_ROOK
            && !this.isAttacked(0, 4, false)
            && !this.isAttacked(0, 5, false);
        }
        if(iRow === 0 && fRow === 0 && fCol <= 2) {
          return this.wqcastle
            && this.pieceAt(0, 3) === Piece.NULL
            && this.pieceAt(0, 2) === Piece.NULL
            && this.pieceAt(0, 1) === Piece.NULL
            && this.piece(0, 0) === Piece.W_ROOK
            && !this.isAttacked(0, 4, false)
            && !this.isAttacked(0, 3, false);
        }
      case Piece.B_KING:
        if(iRow === 7 && fRow === 7 && fCol >= 6) {
          return this.bkcastle
            && this.pieceAt(7, 5) === Piece.NULL
            && this.pieceAt(7, 6) === Piece.NULL
            && this.pieceAt(7, 7) === Piece.B_ROOK
            && !this.isAttacked(7, 4, true)
            && !this.isAttacked(7, 5, true);
        }
        if(iRow === 7 && fRow === 7 && fCol <= 2) {
          return this.bqcastle
            && this.pieceAt(7, 3) === Piece.NULL
            && this.pieceAt(7, 2) === Piece.NULL
            && this.pieceAt(7, 1) === Piece.NULL
            && this.pieceAt(7, 0) === Piece.B_ROOK
            && !this.isAttacked(7, 4, true)
            && !this.isAttacked(7, 3, true);
        }
        return step !== null 
          && fRow === iRow + step[0] 
          && fCol === iCol + step[1];
      case Piece.W_KNIGHT:
      case Piece.B_KNIGHT:
        return step === null 
          && Math.abs(fRow - iRow) + Math.abs(fCol - iCol) === 3;
      case Piece.W_PAWN:
        if(fCol === iCol) {
          return fRow === iRow + 1 || (iRow === 1 && fRow === 3);
        }
        //assert target is black and it's only one step away
        return tblack 
          && step !== null 
          && fRow === iRow + 1 
          && fCol === iCol + step[1];
      case Piece.B_PAWN:
        if(fCol === iCol) {
          return fRow === iRow - 1 || (iRow === 6 && fRow === 4);
        }
        return !tblack 
          && this.pieceAt(fRow, fCol) !== Piece.NULL
          && step !== null 
          && fRow === iRow - 1 
          && fCol === iCol + step[1];
      default:
        throw "Incomplete case match";
    }
  }
  move(iRow, iCol, fRow, fCol) {
    if(!this.validMove(iRow, iCol, fRow, fCol)) return;
    //check for castling
    if(this.pieceAt(iRow, iCol) === Piece.W_KING) {
      this.wkcastle = false;
      this.wqcastle = false;
      if(fCol > iCol + 1) {
        this.board.setPieceAt(0, 4, Piece.NULL);
        this.board.setPieceAt(0, 5, Piece.W_ROOK);
        this.board.setPieceAt(0, 6, Piece.W_KING);
        this.board.setPieceAt(0, 7, Piece.NULL);
        return;
      }
      if(fCol < iCol - 1) {
        this.board.setPieceAt(0, 4, Piece.NULL);
        this.board.setPieceAt(0, 3, Piece.W_ROOK);
        this.board.setPieceAt(0, 2, Piece.W_KING);
        this.board.setPieceAt(0, 0, Piece.NULL);
        return;
      }
    }
    if(this.pieceAt(iRow, iCol) === Piece.B_KING) {
      this.bkcastle = false;
      this.bqcastle = false;
      if(fCol > iCol + 1) {
        this.board.setPieceAt(7, 4, Piece.NULL);
        this.board.setPieceAt(7, 5, Piece.B_ROOK);
        this.board.setPieceAt(7, 6, Piece.B_KING);
        this.board.setPieceAt(7, 7, Piece.NULL);
        return;
      }
      if(fCol < iCol - 1) {
        this.board.setPieceAt(7, 4, Piece.NULL);
        this.board.setPieceAt(7, 3, Piece.B_ROOK);
        this.board.setPieceAt(7, 2, Piece.B_KING);
        this.board.setPieceAt(7, 0, Piece.NULL);
        return;
      }
    }
    //check castling privileges
    if((iRow === 0 && iCol === 0) || (fRow === 0 && fCol === 0)) {
      this.wqcastle = false;
    }
    if((iRow === 0 && iCol === 7) || (fRow === 0 && fCol === 7)) {
      this.wkcastle = false;
    }
    if((iRow === 7 && iCol === 0) || (fRow === 7 && fCol === 0)) {
      this.bqcastle = false;
    }
    if((iRow === 7 && iCol === 7) || (fRow === 7 && fCol === 7)) {
      this.bkcastle = false;
    }
    //check for promotion
    if(this.pieceAt(iRow, iCol) === Piece.W_PAWN && fRow === 7) {
      this.board.setPieceAt(fRow, fCol, Piece.W_QUEEN);
    } else if(this.pieceAt(iRow, iCol) === Piece.B_PAWN && fRow === 0) {
      this.board.setPieceAt(fRow, fCol, Piece.B_QUEEN);
    } else {
      this.board.setPieceAt(fRow, fCol, this.pieceAt(iRow, iCol));
    }
    this.board.setPieceAt(iRow, iCol, Piece.NULL);
  }
  //returns a pair [x, y] representing the direction [fRow, fCol] - [iRow, iCol]
  //if it's a horizontal or vertical line, returns [1, 0], [-1, 0], [0, 1], or
  //[0, -1] according to the direction of travel
  //if it's a diagonal line, returns [1, 1], [1, -1], [-1, 1], or [-1, -1]
  //according to the direction of travel
  //else returns null
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
  //returns whether any pieces of color [color] attack the square [r, c].
  //color is true for white, false for black.
  isAttacked(r, c, color) {
    for(let i = 0; i < 8; i++) {
      for(let j = 0; j < 8; j++) {
        if(this.pieceAt(i, j) < Piece.B_PAWN === color
          && this.validMove(i, j, r, c)) return true;
      }
    }
    return false;
  }
  //if the path from [iRow, iCol] to [fRow, fCol] is a horizontal, vertical, or
  //diagonal line, returns true if there are no pieces between [iRow, iCol] 
  //and [fRow, fCol]
  //else returns false
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
  pieceAt(r, c) {
    return this.board.pieceAt(r, c);
  }
}

module.exports.ChessBoard = ChessBoard;
module.exports.Piece = Piece;

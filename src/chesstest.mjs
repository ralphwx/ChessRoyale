import {ChessBoard} from "./chess.mjs";
import {Piece, Color, colorOf, MoveType} from "./enums.mjs";

let correct = 0;
let total = 0;

function test(name, code) {
  total++;
  try {
    let result = code();
    if(result) {
      console.log(name + ": PASS");
      correct++;
    } else console.log(name + ": FAIL");
  } catch(error) {
    console.log(name + ": CRASHED");
    console.log(error);
  }
}

function checkEq(b1, b2) {
  for(let r = 0; r < 8; r++) {
    for(let c = 0; c < 8; c++) {
      if(b1.pieceAt(r, c) !== b2.pieceAt(r, c)) return false;
    }
  }
  return true;
}

function pieceString(p) {
  switch(p) {
    case Piece.W_PAWN: return "P";
    case Piece.W_ROOK: return "R";
    case Piece.W_KNIGHT: return "N";
    case Piece.W_BISHOP: return "B";
    case Piece.W_QUEEN: return "Q";
    case Piece.W_KING: return "K";
    case Piece.B_PAWN: return "p";
    case Piece.B_ROOK: return "r";
    case Piece.B_KNIGHT: return "n";
    case Piece.B_BISHOP: return "b";
    case Piece.B_QUEEN: return "q";
    case Piece.B_KING: return "k";
    case Piece.NULL: return " ";
    default: throw "Incomplete case match: " + p;
  }
}
function checkEqStr(board, str) {
  if(str.length !== 64) throw "Incorrect str len";
  for(let r = 0; r < 8; r++) {
    for(let c = 0; c < 8; c++) {
      if(pieceString(board.pieceAt(r, c)) !== str[8 * r + c]) return false;
    }
  }
  return true;
}
let t1 = () => {
  let output = true;
  let board = ChessBoard.startingPosition();
  return checkEqStr(board, "RNBQKBNRPPPPPPPP                                pppppppprnbqkbnr");
}

let t2 = () => {
  let board = ChessBoard.startingPosition();
  let board2 = ChessBoard.fromString(board.toString());
  return checkEq(board, board2);
}

let t3 = () => {
  let output = true;
  let board = ChessBoard.startingPosition();
  //illegal rook moves
  board.move(0, 0, 0, 1);
  board.move(0, 0, 1, 0);
  board.move(0, 0, 2, 0);
  board.move(7, 7, 7, 6);
  board.move(7, 7, 7, 5);
  //illegal knight moves
  board.move(0, 1, 1, 0);
  board.move(0, 6, 2, 2);
  board.move(7, 1, 5, 1);
  //illegal pawn moves
  board.move(1, 3, 2, 4);
  board.move(1, 3, 2, 1);
  //illegal queen moves
  board.move(0, 3, 0, 4);
  board.move(0, 3, 4, 3);
  //illegal king moves
  board.move(0, 4, 0, 5);
  board.move(0, 4, 1, 4);
  board.move(0, 4, 0, 6);
  board.move(7, 4, 7, 5);
  board.move(7, 4, 6, 4);
  board.move(0, 4, 0, 2);
  board.move(7, 4, 7, 6);
  board.move(7, 4, 7, 2);
  //illegal bishop moves
  board.move(0, 2, 1, 3);
  board.move(0, 2, 2, 4);
  board.move(7, 5, 6, 6);
  board.move(7, 5, 5, 7);
  return checkEq(board, ChessBoard.startingPosition());
}

let t4 = () => {
  let board = ChessBoard.startingPosition();
  board.move(1, 4, 3, 4);
  board.move(6, 4, 4, 4);
  board.move(0, 3, 4, 7);
  board.move(7, 1, 5, 2);
  board.move(0, 5, 3, 2);
  board.move(7, 6, 5, 5);
  board.move(4, 7, 6, 5);
  if(!checkEq(board, ChessBoard.fromString(board.toString()))) return false;
  let s = "RNB K NRPPPP PPP          B P       p     n  n  pppp Qppr bqkb r";
  return checkEqStr(board, s);
}

let t5 = () => {
  let board = ChessBoard.startingPosition();
  board.move(1, 4, 3, 4);
  board.move(6, 4, 4, 4);
  board.move(0, 6, 2, 7);
  board.move(0, 5, 1, 4);
  board.move(0, 4, 0, 6);
  board.move(6, 3, 5, 3);
  board.move(7, 2, 5, 4);
  board.move(7, 1, 6, 3);
  board.move(7, 3, 4, 6);
  board.move(7, 4, 7, 1);
  if(!checkEq(board, ChessBoard.fromString(board.toString()))) return false;
  let s = "RNBQ RK PPPPBPPP       N    P       p q    pb   pppn ppp  kr bnr";
  return checkEqStr(board, s);
}

test("starting position", t1);
test("to/from String1", t2);
test("illegal moves 1", t3);
test("scholar's mate", t4);
test("castling 1", t5);
console.log(correct + "/" + total + " tests passed");

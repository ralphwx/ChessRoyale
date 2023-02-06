
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

var Color = {
  BLACK: 0,
  WHITE: 1,
  NONE: 2,
}

function colorOf(piece) {
  if(piece === Piece.NULL) return Color.NONE;
  if(piece >= Piece.B_PAWN) return Color.BLACK;
  return Color.WHITE;
}

var MoveType = {
  MOVE: 0,
  ENPESANT: 1,
  CASTLE: 2,
  PROMOTION: 3,
  INVALID: 4,
  PAWN_THRUST: 5,
}

var URL = "http://localhost:8080";
export {Piece, Color, colorOf, MoveType, URL};

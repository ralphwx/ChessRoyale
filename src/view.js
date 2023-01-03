import {ChessBoard, Piece} from "./chess.js";

/**
 * This module provides a React Component for viewing a ChessBoard. See the
 * comment for BoardView.
 */

/**
 * Helper function for converting chess pieces to HTML. Later, the characters
 * will be replaced by images.
 */
function pieceToHTML(p) {
  switch(p) {
    case Piece.NULL: return ' ';
    case Piece.W_PAWN: return 'P';
    case Piece.W_ROOK: return 'R';
    case Piece.W_KNIGHT: return 'N';
    case Piece.W_BISHOP: return 'B';
    case Piece.W_QUEEN: return 'Q';
    case Piece.W_KING: return 'K';
    case Piece.B_PAWN: return 'p';
    case Piece.B_ROOK: return 'r';
    case Piece.B_KNIGHT: return 'n';
    case Piece.B_BISHOP: return 'b';
    case Piece.B_QUEEN: return 'q';
    case Piece.B_KING: return 'k';
    default: throw "Incomplete case match";
  }
}

/**
 * props is required to have board, selectRow, and selectCol fields.
 * board is the ChessBoard object to be displayed
 * selectRow, selectCol are the row and column indices of the square
 * to be highlighted. These parameters should be -1 if no square should be
 * highlighted.
 */
export function BoardView(props) {
  var squares = []
  for(let i = 7; i >= 0; i--) {
    var row = [];
    for(let j = 0; j < 8; j++) {
      let type;
      if(i === props.selectRow && j === props.selectCol) type = "select";
      else if((i + j) % 2) type = "odd";
      else type = "even";
      let id = pieceToHTML(props.board.pieceAt(i, j));
      row.push(<Square id={id} type={type}
        onClick={(e) => {
          props.onClick(i, j);
        }}
      />);
    }
    squares.push(<div className="gridrow">{row}</div>);
  }
  return (<div>{squares}</div>);
}

/**
 * props is required to have type, onClick, and id fields.
 * type should be "even" "odd" or "select"
 * the onClick function is the function called on click, and id is the
 * html displayed on the square itself.
 */
function Square(props) {
  let color;
  switch(props.type) {
    case "even":
      color = "#beaed4";
      break;
    case "odd":
      color = "#fdc086";
      break;
    case "select":
      color = "#ffffb3";
      break;
    default: throw "Incomplete case match" + props.type;
  }
  return (
    <button className={"square"} onClick={props.onClick} style={{
      backgroundColor: color,
    }}>
      {props.id}
    </button>
  );
}

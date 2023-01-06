import {ChessBoard, Piece} from "./chess.js";
import img_null from "./img/null.png";
import w_pawn from "./img/w_pawn.png";
import w_rook from "./img/w_rook.png";
import w_knight from "./img/w_knight.png";
import w_bishop from "./img/w_bishop.png";
import w_queen from "./img/w_queen.png";
import w_king from "./img/w_king.png";
import b_pawn from "./img/b_pawn.png";
import b_rook from "./img/b_rook.png";
import b_knight from "./img/b_knight.png";
import b_bishop from "./img/b_bishop.png";
import b_queen from "./img/b_queen.png";
import b_king from "./img/b_king.png";

/**
 * This module provides a React Component for viewing a ChessBoard. See the
 * comment for BoardView.
 */

/**
 * Helper function for converting chess pieces to HTML. Later, the characters
 * will be replaced by images.
 */
function pieceToHTML(p) {
  let img_src = (() => {
    switch(p) {
      case Piece.NULL: return img_null;
      case Piece.W_PAWN: return w_pawn;
      case Piece.W_ROOK: return w_rook;
      case Piece.W_KNIGHT: return w_knight;
      case Piece.W_BISHOP: return w_bishop;
      case Piece.W_QUEEN: return w_queen;
      case Piece.W_KING: return w_king;
      case Piece.B_PAWN: return b_pawn;
      case Piece.B_ROOK: return b_rook;
      case Piece.B_KNIGHT: return b_knight;
      case Piece.B_BISHOP: return b_bishop;
      case Piece.B_QUEEN: return b_queen;
      case Piece.B_KING: return b_king;
      default: throw "Incomplete case match";
    }
  })();
  return <img src={img_src} alt="?"/>;
}

/**
 * props is required to have board, selectRow, and selectCol fields.
 * board is the ChessBoard object to be displayed
 * selectRow, selectCol are the row and column indices of the square
 * to be highlighted. These parameters should be -1 if no square should be
 * highlighted.
 * 
 * props needs to have a field color. If white, displays the board from
 * white's perspective, if black, displays the board from black's perspective.
 */
export function BoardView(props) {
  var squares = []
  if(props.color === "white") {
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
  } else if(props.color === "black") {
    for(let i = 0; i < 8; i++) {
      var row = [];
      for(let j = 7; j >= 0; j--) {
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

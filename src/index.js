
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

var startingPosition = "rnbqkbnrpppppppp";
for(let i = 0; i < 32; i++) startingPosition += " ";
startingPosition += "PPPPPPPPRNBQKBNR";
class Controller {
  constructor() {
    this.state = {
      selectRow: -1,
      selectCol:-1,
      pieces: startingPosition,
    }
  }
  pieceAt(i, j) {
    return this.state.pieces[8 * i + j];
  }
  setPiece(i, j, p) {
    let index = 8 * i + j;
    let cs = this.state.pieces;
    this.state.pieces = cs.substring(0, index) + p + cs.substring(index + 1);
  }
  onClick(i, j) {
    if(this.state.selectRow == -1) {
      if(this.pieceAt(i, j) != " ") {
        this.state.selectRow = i;
        this.state.selectCol = j;
      } 
      return;
    }
    //else, some piece is already selected, and a move is attempted
    this.setPiece(i, j, this.pieceAt(this.state.selectRow, this.state.selectCol));
    this.setPiece(this.state.selectRow, this.state.selectCol, " ");
    this.state.selectRow = -1;
    this.state.selectCol = -1;
  }
  getDisplayState() {
    return {
      rows: 8,
      cols: 8,
      pieces: this.state.pieces,
      selectRow: this.state.selectRow,
      selectCol: this.state.selectCol,
    }
  }
}
class BoardView extends React.Component {
  constructor(props) {
    super(props);
    this.controller = new Controller();
    this.state = this.controller.getDisplayState();
  }
  onClick(i, j) {
    this.controller.onClick(i, j);
    this.setState(this.controller.getDisplayState());
  }
  render() {
    var squares = [];
    var index = 0;
    for(let i = 0; i < this.state.rows; i++) {
      var row = []
      for(let j = 0; j < this.state.cols; j++) {
        let type;
        if(i == this.state.selectRow && j == this.state.selectCol) {
          type = "highlight";
        } else type = (i + j) % 2 ? "odd" : "even";
        row.push(<Square 
          id={this.state.pieces[index]} 
          type={type} 
          onClick={(e) => {this.onClick(i, j)}}
          key={index}
          />);
        index++;
      }
      squares.push(<div className="gridrow" key={index}>{row}</div>);
    }
    return (
      <div>
        {squares}
      </div>
    );
  }
}
 
class Square extends React.Component {
  render() {
    var classname = this.props.type + "-square";
    return (
      <button 
        className={classname} 
        onClick={this.props.onClick}
      >
        {this.props.id}
      </button>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
var state = "rnbqkbnrpppppppp";
for(var i = 0; i < 32; i++) state += " ";
state += "PPPPPPPPRNBQKBNR";
root.render(<BoardView rows={8} cols={8} pieces={state}/>);

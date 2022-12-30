import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {ChessBoard, Piece} from "./chess.js";
import {BoardView} from "./view.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
let board = ChessBoard.startingPosition();
let view = <BoardView board={board} selectRow={-1} selectCol={-1}/>;
root.render(view);

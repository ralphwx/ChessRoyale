import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {ChessBoard, Piece} from "./chess.js";
import {BoardView} from "./view.js";
import {Controller} from "./controller.js";

console.log(ChessBoard);
const root = ReactDOM.createRoot(document.getElementById("root"));
let view = <Controller ip={"localhost"} port={3000} />;
//let view = <BoardView board={ChessBoard.startingPosition()}/>;
root.render(view);

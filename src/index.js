import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {ChessBoard, Piece} from "./chess.js";
import {BoardView} from "./view.js";
import {Controller} from "./controller.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
let view = <Controller ip={"localhost"} port={3000} />;
root.render(view);

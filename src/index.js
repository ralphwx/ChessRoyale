import React from "react";
import ReactDOM from "react-dom/client";
import {Lobby} from "./lobby.js";
import {Game} from "./game.js";
import {Manager} from "./manager.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Manager />);
//root.render(<img src={require("./img/b_bishop.png")}/>);

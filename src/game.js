import React from "react";
import ReactDOM from "react-dom/client";
import {connect} from "./authclient.mjs";
import {URL, Color} from "./enums.mjs";
import {BoardView} from "./view.js";
import {ChessBoard} from "./chess.mjs";
import "./index.css";
import {ResourceBar} from "./resourcebar.js";
import {HeaderRow} from "./header.js";
class Game extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <div>
      <HeaderRow />
      <div className="gamecontainer">
        <div>
          <BoardView
            board={ChessBoard.startingPosition()}
            selectRow={-1}
            selectCol={-1}
            onClick={() => {}}
            color={Color.WHITE}
            delay={[]}
          />
          <ResourceBar amount={3.14} />
        </div>
        <div className="metabox">
          <div className="info"></div>
          <div className="ready"></div>
          <div className="console"></div>
          <div className="ready"></div>
          <div className="info"></div>
          <div className="gamectrl"></div>
        </div>
      </div>
    </div>
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

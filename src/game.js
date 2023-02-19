import React from "react";
import ReactDOM from "react-dom/client";
import {connect} from "./authclient.mjs";
import {URL} from "./enums.mjs";

class Game extends React.Component {
  constructor(props) {
    super(props);
//    if(localStorage.getItem("username") === null) {
//      window.location.replace(URL + "/login");
//    }
//    connect(URL,
//      JSON.parse(localStorage.getItem("username")),
//      JSON.parse(localStorage.getItem("password")),
//      false, (socket) => {
//        this.socket = socket;
//      },
//      () => {
//        window.location.replace(URL + "/login");
//      }
//    );
  }
}
function App() {
  return <div style={{
    display: "flex",
    marginLeft: "auto",
    marginRight: "auto",
  }}>
    <div id="chessboard" style={{
      width: 400,
      height: 400,
      backgroundColor: "orange",
    }}>
    </div>
    <div id="metabox" style={{
      width: 200,
      height: 200,
      backgroundColor: "red",
    }}></div>
  </div>
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

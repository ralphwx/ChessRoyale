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
  return <div>
    <div style={{
      height: "",
      backgroundColor: "orange",
      display: "flex",
      marginTop: "auto",
      marginBottom: "auto",
    }}>
      <div style={{
        width: "200px",
        height: "400px",
        marginLeft: "auto",
        border: "2px solid green",
        opacity: 0.5,
      }}></div>
      <div style={{
        width: "400px",
        height: "400px",
        border: "2px solid red",
        backgroundColor: "red",
        opacity: 0.5,
      }}>
      </div>
      <div style={{
        width: "200px",
        height: "400px",
        marginRight: "auto",
        border: "2px solid green",
        backgroundColor: "green",
        opacity: 0.5,
      }}>
      </div>
    </div>
  </div>
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

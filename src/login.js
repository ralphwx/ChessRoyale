import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {HeaderRow} from "./header.js";
import {connect} from "./authclient.mjs";
import {URL} from "./enums.mjs";

class LoginBox extends React.Component {
  handleSubmit(e) {
    e.preventDefault();
    let create = (e.nativeEvent.submitter.name !== "submit");
    let username = document.querySelector("#username-input").value;
    let password = document.querySelector("#password-input").value;
    connect(URL, username, password, create, (client) => {
      localStorage.setItem("username", JSON.stringify(username));
      localStorage.setItem("password", JSON.stringify(password));
      window.location.replace(URL);
    }, () => {
      if(create) alert("account creation failure");
      else alert("login failed");
    });
  }
  render() {
    return <div id="loginBox">
        <form onSubmit={(e) => this.handleSubmit(e)}>
          <div className="entry">
            <label>Username:</label>
            <input type="text" id="username-input"/>
            <br/>
          </div>
          <div className="entry">
            <label>Password:</label>
            <input type="password" id="password-input"/>
            <br/>
          </div>
          <input type="submit" name="submit" value="Log In" />
          <input type="submit" name="create" value="Create Account" />
        </form>
      </div>
  }
}

function LoginWindow(props) {
  return <div>
    <HeaderRow />
    <LoginBox />
  </div>
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<LoginWindow />);

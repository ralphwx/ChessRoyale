import React from "react";
import logo from "./img/logo.png";
import {URL} from "./enums.mjs";

class HeaderRow extends React.Component {
  logout() {
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    window.location.replace(URL + "/login");
  }
  render() {
    let username = JSON.parse(localStorage.getItem("username"));
    let userbox = <div></div>;
    if(username !== null) {
      userbox = <div>
        Logged in as {username}
        <br/>
        <button id="logout" onClick={() => this.logout()}>Log out</button>
      </div>
    }
    return <div id="header_row">
      <div className="userwrapper" style={{width: "50%"}}>{userbox}</div>
      <div className="logowrapper"><img src={logo} id="logo" alt="?"/></div>
    </div>
  }
}

export {HeaderRow};

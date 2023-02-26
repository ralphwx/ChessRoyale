import React from "react";

export class HoverButton extends React.Component {
  constructor(props) {
    super(props);
    this.innerHTML = props.innerHTML;
    this.innerHTMLHover = props.innerHTMLHover;
    this.className = props.className;
    this.classNameHover = props.classNameHover;
    this.state = {
      hover: false,
    }
    this.onClick = props.onClick;
  }
  render() {
    if(this.state.hover) {
      return <button 
        className={this.classNameHover} 
        onMouseLeave={() => {this.setState({hover: false});}}
        onClick={this.onClick}
      >
        {this.innerHTMLHover}
      </button>
    }
    return <button
      className={this.className}
      onMouseEnter={() => {this.setState({hover: true})}}
      onClick={this.onClick}
    >
      {this.innerHTML}
    </button>
  }
}

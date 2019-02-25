import React, { Component } from 'react';

export default class Inputs extends Component{
  constructor(props) {
    super(props);
    this.state = {
      value: 'obstacle',
      size: 0,
    }
  }

  handleSizeChange = (e) => {
    e.preventDefault();
    let regex = /[^0-9]/
    let size;
    if (e.target.value === '') {
      size = 0;
    } else {
      size = parseInt(e.target.value, 10);
    }
    if (regex.test(e.target.value)) {
      return;
    }
    
    if (size > 10) {
      return;
    }
    this.setState({size: size}, ()=>{console.log(this.state.size); console.log(typeof this.state.size)})
  }

  passSubmit = (e) => {
    e.preventDefault();
    console.log('pass', e);
    this.props.handleClick(this.state.size);
  }

  renderDropDown = () => {
    return (
    <select onChange={this.props.handleTaskSelect} value={this.props.task}>
      <option value="obstacle">Place Obstacle</option>
      <option value="clearObstacle">Clear Obstacle</option>
      <option value="placeStart">Place Start</option>
      <option value="placeEnd">Place End</option>
    </select>
    )
  }

  renderGridSizer = () => {
    return (
      <form onSubmit={this.passSubmit}>
        Choose a grid size (between 1 and 10)
        <textarea onChange={this.handleSizeChange} value={this.state.size}>
        </textarea>
        <input type="submit" value="Create grid!"></input>
      </form>
    )
  }

render() {
  return(<div></div>)
  return (
    <div>
      {this.renderGridSizer()}
      Choose a task:
      {this.renderDropDown()}
    </div>
    )
  }
}
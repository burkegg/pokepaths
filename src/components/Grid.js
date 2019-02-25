import React, { Component } from 'react';
import Square from './Square.js';
export default class Grid extends Component{
  constructor(props) {
    super(props);
    this.state = {
      size: '',
    }
  }

  renderDropDown = () => {
    /*
    Returns dropdown menu to choose click task.  
    */

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
    /* 
    Returns the view of the grid size textarea.
    Calls handleSizeChange
    */
    const { handleSizeChange, size } = this.props;
    return (
      <div>
        Choose a grid size (between 2 and 10)
        <textarea onChange={handleSizeChange} value={size}>
        </textarea>
      </div>
    )
  }

  
  renderGridSquares = () => {
    let { handleClick } = this.props;
    let grid = this.props.grid.flat();
    return (
      <div>
        {grid.map( (sqr) => {
            return(
              <Square handleClick={handleClick} key={sqr.id} id={sqr.id} data={sqr.data}/>
            )
        })}
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.renderGridSizer()}
        {this.renderDropDown()}
        <div id="grid">
          {this.renderGridSquares()}
        </div>

      </div>
    )
  }
}

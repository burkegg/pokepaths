import React, { Component } from 'react';
import Grid from './components/Grid.js';
import Inputs from './components/Inputs.js';
import Answer from './components/Answer.js';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      size: '',
      task: 'obstacle',
      grid: [],
      startExists: false,
      endExists: false,
      moves: null,
      answered: true,
    }
  }

  makeApiDataObj = () => {
    const { size, grid, } = this.state;
    console.log('grid in make data', grid)
    let data = {};
    data.sideLength = parseInt(size, 10);
    let impassables = [];

    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid.length; x++) {
        if (grid[x][y].data === 'obstacle') {
          let locObj = {};
          locObj.y = x;
          locObj.x = y;
          impassables.push(locObj);
        } else if (grid[x][y].data === 'start') {
          console.log('found start')
          let startingLocData = {};
          startingLocData.y = x;
          startingLocData.x = y;
          data.startingLoc = startingLocData;
        } else if (grid[x][y].data === 'end') {
          let endLocData = {};
          endLocData.x = y;
          endLocData.y = x;
          data.endingLoc = endLocData;
        }
      }
    }
    data.impassables = impassables;    
    return data;
  }

  getAnswer = () => {
    /* 
      Take in the starting grid and fetch the answer from the API
    */

    let data = this.makeApiDataObj();
    console.log('inside getAnswer', data);
    let url = 'https://frozen-reef-96768.herokuapp.com/find-path';
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      mode: 'cors',
      headers: {
        "Content-Type" : "application/json"
      }
    })
    .then(response => {
      return response.json()
    })
    .then(res => {
      console.log(res)
      if (!this.state.answered) {
        this.setState({moves: res.moves, answered: true}) 
      }
    })
    .catch(err => console.error('error', err))
  }

  makeGrid = (n) => {
    /* 
    Creates a grid of n x n empty cells

    params: n <str>
    returns: arr <Array>
    */
    let arr = [];
    for (let i = 0; i < n; i++) {
      arr.push([]);
      for (let j = 0; j < n; j++) {
        arr[i].push(new Array(n));
        arr[i][j] = {id: this.giveID(i, j), data: null};
      }
    }
    this.setState({grid: arr });
  }

  animateReturn = () => {
    const { grid, } = this.state;
    let goneHome = false;
  }

  giveID = (x, y) => {
    /* 
    Gives an id based on a cell's location in a grid

    params: x, y <int> <int>
    return: id <int>
    */

    let id = '' + x + y;
    return id;
  }

  handleSizeChange = (e) => {
    /*
    Sets state as new size from input.  
    Checks to make sure user enters a digit.
    params: e <synthetic event>
    return:  sets state size <str>
    */
    e.preventDefault();
    let regex = /[^0-9]/
    let size = e.target.value;
    if (regex.test(size)) {
      size.replace(regex, '');
      return;
    }
    if (parseInt(size, 10) > 10) return;
    if (size === '' || parseInt(size, 10) === 0) {
      this.setState({startExists: false, endExists: false, answered: false})
    }
    this.setState({size: size}, ()=>{this.makeGrid(size)});
  }
  handleTaskSelect = (e) => {
    e.preventDefault();
    this.setState({task: e.target.value})
  }
  handleClick = (val) => {
    console.log('handleClick', val);
    const { task, grid } = this.state;
    if (task === 'obstacle') {
      grid[val[0]][val[1]].data = 'obstacle';
      this.setState({ grid: grid }, ()=>{console.log(this.state.grid)})
    } else if (task === 'clearObstacle' && grid[val[0]][val[1]].data === 'obstacle') {
      grid[val[0]][val[1]].data = null;
      this.setState({ grid: grid }, ()=>{console.log(this.state.grid)})
    } else if (task === 'placeStart' && !this.state.startExists) {
      grid[val[0]][val[1]].data = 'start';
      this.setState({ grid: grid, startExists: true }, ()=>{console.log(this.state.grid)})
    } else if (task === 'placeEnd' && !this.state.endExists) {
      grid[val[0]][val[1]].data = 'end';
      this.setState({ grid: grid, endExists: true }, ()=>{console.log(this.state.grid)})
    } else {
      return;
    }
  }

  renderAnswer = () => {
    const { moves } = this.state;
    if (this.state.startExists && this.state.endExists) {
      return (
        <div id="answer">
            <Answer
              getAnswer={this.getAnswer}
              moves={moves}
            />
        </div>
      )
    } else {
      return;
    }
  }

  render() {
    const { clickType, size, task, grid, startExists, endExists, } = this.state;
    return (
      <div className="App">
        {this.renderAnswer()}
        
        <Grid handleClick={this.handleClick}
          size={size}
          task={task}
          grid={grid}
          handleTaskSelect={this.handleTaskSelect}
          handleSizeChange={this.handleSizeChange}
          getAnswer={this.getAnswer}
        />
        
      </div>
    )
  }
}

export default App;

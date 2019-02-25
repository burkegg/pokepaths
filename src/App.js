import React, { Component } from 'react';
import Grid from './components/Grid.js';
import Answer from './components/Answer.js';
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
      possible: true,
    }
  }

  makeApiDataObj = () => {
    const { size, grid, } = this.state;
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
      Calls
    */
    let data = this.makeApiDataObj();
    let url = 'https://frozen-reef-96768.herokuapp.com/find-path';
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      mode: 'cors',
      headers: {
        "Content-Type" : "application/json"
      }
    })
    .then(res=>{
      if(res.ok) {
        return res.json();
      } else {
        throw Error(res.status);
      }
    })
    .then(res => {
      if (!this.state.answered) {
        this.setState({moves: res.moves, answered: true}) 
      }
      return res.moves;
    })
    .then((moves)=>{
      if (moves && moves.length > 0) {
        this.animateReturn(moves);
      }
      return moves;
    })
    .catch(err => {
      console.log('error', err)
      this.setState({possible: false})
    })
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

  animateReturn = (moves) => {
    let { grid, } = this.state;
    let curr;
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid.length; j++) {
        if (grid[i][j].data === 'start') {
          curr = [i, j];
        }
      }
    }
    let idx = 0;

    let moveOne = ()=>{
      let prev = curr.slice();
      if (moves[idx] === 'D') {
        curr[0] = curr[0] + 1 
      } else if (moves[idx] === 'R') {
        curr[1] = curr[1] + 1;
      } else if (moves[idx] === 'U') {
        curr[0] = curr[0] - 1;
      } else if (moves[idx] === 'L') {
        curr[1] = curr[1] - 1;
      }
      grid[prev[0]][prev[1]].data = null;
      grid[curr[0]][curr[1]].data = 'bulbasaur';
      this.setState({grid: grid})
      idx++;
      if (idx === moves.length) {
        clearInterval(this.myInterval);
      }
    }
    this.myInterval = setInterval(moveOne, 500);
    

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
      this.setState({startExists: false, endExists: false, answered: false, possible: true})
    }
    this.setState({size: size}, ()=>{this.makeGrid(size)});
  }
  handleTaskSelect = (e) => {
    e.preventDefault();
    this.setState({task: e.target.value})
  }
  handleClick = (val) => {
    const { task, grid } = this.state;
    if (task === 'obstacle') {
      grid[val[0]][val[1]].data = 'obstacle';
      this.setState({ grid: grid })
    } else if (task === 'clearObstacle' && grid[val[0]][val[1]].data === 'obstacle') {
      grid[val[0]][val[1]].data = null;
      this.setState({ grid: grid })
    } else if (task === 'placeStart' && !this.state.startExists) {
      grid[val[0]][val[1]].data = 'start';
      this.setState({ grid: grid, startExists: true })
    } else if (task === 'placeEnd' && !this.state.endExists) {
      grid[val[0]][val[1]].data = 'end';
      this.setState({ grid: grid, endExists: true })
    } else {
      return;
    }
  }

  renderAnswer = () => {
    const { possible } = this.state;
    if (this.state.startExists && this.state.endExists) {
      return (
        <div id="answer">
            <Answer
              getAnswer={this.getAnswer}
              possible={possible}
            />
        </div>
      )
    } else {
      return;
    }
  }

  renderFailure = () => {
    if (!this.state.possible) {
      return (
        <h2>
          You can't get there from here!
        </h2>
      )
    }
  }

  render() {
    const { size, task, grid, } = this.state;
    return (
      <div className="App">
        {this.renderAnswer()}
        <div id="failure">
          {this.renderFailure()}
        </div>
        
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

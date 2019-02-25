import React, { Component } from 'react';
const Square = (props) => {
  /*
    A stateless copmonent.  
    Props: 
      id: the stringified location in the grid.
      data: the description of which image to display.
  */
  
  const passClick = ()=>{
    const { handleClick, id } = props;
    handleClick(id);
  }

  const showPic = () => {
    const { id, data,  } = props;
    const sqrStyle = {
      top: id[0] * 33,
      left: id[1] * 33,
    }
    let imgSrc;
    let altText;
    if (data === 'obstacle') {
      imgSrc = "./images/rocktile.png";
      altText = "An impassable square"
    } else if (data === 'end') {
      imgSrc = "./images/finishtile.png";
      altText = "The finish square"
    } else if (data === 'bulbasaur') {
      imgSrc = "./images/bulbasaur.png";
      altText = "The current location of the bulbasaur"
    } else if (data === null) {
      imgSrc = "./images/grasstile.png";
      altText = "A passable tile"
    } else if (data === 'start') {
      imgSrc = "./images/bulbasaur.png"
      altText = "The start location."
    }else {
      imgSrc = "./images/grasstile.png";
      altText = "A passable square."
    }
    return(
      <div>
      <img src={imgSrc}
        className="square"
        alt={altText}
        onClick={passClick}
        style={sqrStyle}
      />
      </div>
    )
  }

  return (showPic())
}

export default Square;

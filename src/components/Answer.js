import React, { Component } from 'react';

const Answer = (props) => {
  const { getAnswer, moves } = props;
  console.log('moves in answer', moves);
  return(
    <div id="answer">
      <input type="submit" value="Get home!" onClick={getAnswer}/>
    </div>
  )
}

export default Answer;
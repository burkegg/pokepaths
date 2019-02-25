import React from 'react';

const Answer = (props) => {
  const { getAnswer } = props;
  return(
    <div id="answer">
      <input type="submit" value="Get home!" onClick={getAnswer}/>
    </div>
  )
}

export default Answer;
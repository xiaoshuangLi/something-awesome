import React, { Component } from 'react';

const list = [
  '1st Rule: You don not talk about FIGHT CLUB.',
  '2nd Rule: You don not talk about FIGHT CLUB.',
  '3rd Rule: If someone says \'stop\' or goes limp, taps out fight is over.',
  '4th Rule: Only two guys to a fight.',
  '5th Rule: One fight at a time.',
  '6th Rule: No shirts, no shoes.',
  '7th Rule: Fight will go on as long as they have to.',
  '8th Rule: If this is you first night at FIGHT CLUB, you have to fight.',
];

class Mario extends Component {
  render() {
    const questions = list.map((item, i) => {
      return (
        <div className="question-posiiton" key={i}>
          <div className="question" data-before="?" data-after={item} >
            <div className="title"> {item} </div>
          </div>
        </div>
      );
    });

    const style = {
      width: `${(list.length + 1) * 100}vw`,
    };

    return (
      <div className="pages-sass-mario-render" style={style}>
        <div className="mario-board">
          <div className="nails top" />
          <div className="nails bottom" />
          <div className="title">HELLO <br/> WORLD</div>
        </div>
        <div className="mario-questions">
          { questions }
        </div>
        <div className="mario jump" />
        <div className="mario-base" />
      </div>
    );
  }
}

export default Mario;

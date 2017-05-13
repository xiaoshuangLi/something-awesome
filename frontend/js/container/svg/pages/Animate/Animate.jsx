import React, { Component } from 'react';

class Animate extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="page-svg-animate-render">
      <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 250 250">
          <text id="Hi" fill="#000" style={{fontSize: '100px', strokeWidth: '20px', stroke: '#000', fontFamily: "Bradley Hand"}} class="cls-1" x="-10.961" y="113.336">Hi.
            <animateTransform attributeName="transform" begin="test.click" dur="3s"  type="scale" from="1" to="1.5" repeatCount="indefinite"/>
          </text>
        </svg>

        <div className="cube" />
      </div>
    );
  }
}

export default Animate;

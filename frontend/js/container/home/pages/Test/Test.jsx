import React, { Component } from 'react';

class Test extends Component {
  test = () => {
    console.log(this);
  }
  render() {
    this.test();

    return (
      <div className="page-home-test-render">
        test
      </div>
    );
  }
}

export default Test;

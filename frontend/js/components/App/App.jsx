import React, { Component } from 'react';

class App extends Component {
  componentWillMount() {
    document.addEventListener('touchstart', () => {});
  }

  render() {
    return (
      <div className="app-container">
        {this.props.children}
      </div>
    );
  }
}

export default App;

import React, { Component, PropTypes } from 'react';
import io from 'socket.io-client';

const socket = io(window.location.origin);

class App extends Component {
 getChildContext() {
    return {
      socket,
    };
  }
  componentWillMount() {
    document.addEventListener('touchstart', () => {});

    socket.on('go', (path) => {
      this.props.router.push(path);
    })
  }

  render() {
    return (
      <div className="app-container">
        {this.props.children}
      </div>
    );
  }
}

App.childContextTypes = {
  socket: PropTypes.object
};

export default App;

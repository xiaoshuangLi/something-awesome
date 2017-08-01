import { Component, Children } from 'react';

class App extends Component {
  render() {
    return this.props.children ? Children.only(this.props.children) : null;
  }
}

export default App;

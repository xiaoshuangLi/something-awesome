import React, { Component } from 'react'
import { render } from 'react-dom'

import 'css/index.scss';

class App extends Component {
  render() {
    return (
      <div className="container">
       app
      </div>
    )
  }
}

render(
  <App />,
  document.getElementById('app')
)
import React, { Component, PropTypes, Children } from 'react'
import { render } from 'react-dom'

import { Form, Input } from './validate';

class App extends Component {
  render() {
    return (
      <Form onChange={(value, validate) => {console.log(value, validate)}}>
        <Input name="username" maxLength="10" onChange={(value, validate) => {console.log(value, validate)}}>
          <input type="text"/>
        </Input>
        <Input name="password" max="10" onBlur={(val) => {console.log(val)}}>
          <input type="password"/>
        </Input>
      </Form>
    );
  }
}

render(
  <App />,
  document.getElementById('app')
)

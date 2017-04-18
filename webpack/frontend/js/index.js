import React, { Component, PropTypes, Children } from 'react'
import { render } from 'react-dom'

import { Form, Input } from './validate';

class App extends Component {
  render() {
    return (
      <Form onChange={(a, b) => {console.log(a,b )}}>
        <Input name="username" maxLength="10" validateInChange={true} onChange={(a, b) => {console.log(a,b )}}>
          <input type="text"/>
        </Input>
        <Input name="password" max="10" validateInChange={true} onChange={(val) => {console.log(val)}}>
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

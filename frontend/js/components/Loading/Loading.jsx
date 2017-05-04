import React, { Component } from 'react'
import TransitionGroup from 'react-addons-transition-group'

export default class Res extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { show, children } = this.props

    return (
      <TransitionGroup>
        { show ? children : null }
      </TransitionGroup>
    )
  }
}
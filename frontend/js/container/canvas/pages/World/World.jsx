import React, { Component } from 'react';
import classnames from 'classnames';

import Loading from 'js/components/Loading';
import { timeout } from 'js/common';

import Board from '../../components/Board';

// import build from './build';
import dance from './dance';

class World extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
    };
  }

  componentDidMount() {
    this._stopLoading();
  }

  _stopLoading() {
    // timeout(() => {
    //   this.setState({
    //     loaded: true,
    //   }, () => build('#world'));
    // }, 9600);
    timeout(() => {
      this.setState({
        loaded: true,
      }, () => dance('#world'));
    }, 0);
  }

  renderBoard() {
    const { loaded } = this.state;

    return (
      <Loading show={!loaded}>
        <Board className="world-board" />
      </Loading>
    );
  }

  render() {
    const { className } = this.props;

    const cls = classnames({
      'pages-canvas-world-render': true,
      [className]: !!className,
    });

    return (
      <div className={cls}>
        { this.renderBoard() }
        <canvas id="world" className="canvas" />
      </div>
    );
  }
}

export default World;

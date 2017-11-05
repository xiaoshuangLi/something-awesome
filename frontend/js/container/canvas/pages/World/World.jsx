import React, { Component } from 'react';
import classnames from 'classnames';

import Loading from 'js/components/Loading';
import { timeout } from 'js/common';

import Board from '../../components/Board';

// import build from './build';
import dance from './dance';
import screen from './screen';

let isScreen = true;

const setScreen = (res) => {
  isScreen = !!res;
};

const getScreen = () => {
  return isScreen;
};

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
    const res = [
      { world: '#world', screen: '#screen' },
      { getScreen, setScreen },
    ];

    timeout(() => {
      this.setState({
        loaded: true,
      }, () => {
        screen(...res);
        dance(...res);
      });
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
        <canvas id="screen" className="canvas screen" />
        <canvas id="world" className="canvas" tabIndex={1}/>
      </div>
    );
  }
}

export default World;

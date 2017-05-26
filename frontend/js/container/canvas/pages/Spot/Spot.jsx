import React, { Component } from 'react';

import Me from './me.jpg';
import Durden from './durden.jpg';

import Canvas from '../../components/Spot';

const imgs = [Me, Durden];
const order = 1;

class Spot extends Component {

  componentDidMount() {
    this.init();
  }

  init() {
    const ele = new Canvas({
      cva: '#canvas',
      order,
      imgs,
      speed: 1.5,
      freeze: 2,
    });

    ele.setCva({
      strokeStyle: 'rgba(0,0,0,0)',
    });
  }

  render() {
    return (
      <div className="page-canvas-spot-render">
        <canvas id="canvas" />
      </div>
    );
  }
}

export default Spot;


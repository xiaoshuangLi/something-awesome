import React, { Component } from 'react';

import Me from './me.jpg';
import Durden from './durden.jpg';

import Canvas from '../../components/View';

const _calc = (a, b, step) => {
  return Math.ceil(a + (b - a) * step);
};

function createSpots(data) {
  const { from = [], to = [], curr } = data;

  const { length } = from;
  const res = [];

  for (let v = 0; v < length; v++) {
    const fromItem = from[v];
    const toItem = to[v];

    const fromColor = fromItem.color || [];
    const toColor = toItem.color || [];

    res[v] = {
      x: _calc(fromItem.x, toItem.x, curr),
      y: _calc(fromItem.y, toItem.y, curr),
      color: [_calc(fromColor[0], toColor[0], curr), _calc(fromColor[1], toColor[1], curr), _calc(fromColor[2], toColor[2], curr), _calc(fromColor[3], toColor[3], curr)],
    };
  }

  return res;
}

const imgs = [Me, Durden];

const speed = 1;
const per = 1 / (60 * speed);

class View extends Component {

  componentDidMount() {
    this.init();
  }

  init() {
    const ele = new Canvas({
      cva: '#canvas',
      list: [{
        imgs,
        useImageData: true,
        size: 1,
        render: function (ctx, cw, ch) {
          const { spots = [] } = this.state;
          const imageData = ctx.createImageData(cw, ch);

          imageData.getDataFrom(spots[0], ctx);
        },
        update: function (ctx, cw, ch) {
          return new Promise((resolve) => {
            let { curr = 0 } = this.state;
            const { index = 0, spots = [] } = this.state;
            const next = (index + 1) % spots.length;

            curr += per;

            if (curr >= 1) {
              this.state.index = next;
              this.state.curr = 0;
            } else {
              this.state.curr = curr;
            }

            const data = createSpots({
              from: spots[index],
              to: spots[next],
              curr,
            });

            const imageData = ctx.createImageData(cw, ch);
            imageData.getDataFrom(data, ctx);
            resolve();
          });
        },
      }],
    });

    ele.setCva({
      strokeStyle: 'rgba(0,0,0,0)',
    });
  }

  render() {
    return (
      <div className="page-canvas-view-render">
        <canvas id="canvas" />
      </div>
    );
  }
}

export default View;


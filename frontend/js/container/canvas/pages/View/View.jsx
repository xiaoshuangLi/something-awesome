import React, { Component } from 'react';

import Me from './me.jpg';
import Durden from './durden.jpg';

import Canvas from '../../components/View';
import CalcSpotsJS from './calcSpots_inline';

const CalcSpotsWorker = new Worker(CalcSpotsJS);

const postMessage = (data) => {
  CalcSpotsWorker.postMessage(data);
};

const reveive = (cb) => {
  CalcSpotsWorker.onmessage = (e) => {
    cb && cb(e.data);
  };
};

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
        size: 2,
        render: function (ctx, cw, ch) {
          const { spots = [] } = this.state;
          const imageData = ctx.createImageData(cw, ch);

          imageData.from(spots[0], ctx);
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

            reveive((data) => {
              const imageData = ctx.createImageData(cw, ch);

              imageData.from(data, ctx);
              resolve();
            });

            postMessage({
              from: spots[index],
              to: spots[next],
              curr,
            });
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


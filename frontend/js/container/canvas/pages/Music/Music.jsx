import React, { Component } from 'react';

import Durden from './durden.jpg';
import Canvas from '../../components/View';

let voice = [];
const src = 'http://oi9dcgq2m.bkt.clouddn.com/Hozier%20-%20Take%20Me%20To%20Church.mp3';
const song = {
  src,
  _partLoad() {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.preload = 'true';
      audio.autoplay = 'true';
      audio.loop = 'true';
      audio.crossOrigin = 'anonymous';
      audio.src = this.state.src;

      audio.oncanplay = () => {
        // audio.play();
        this.setState({
          eles: [audio],
        }, resolve);
      };

      const audioCtx = new(window.AudioContext || window.webkitAudioContext);
      const source = audioCtx.createMediaElementSource(audio);
      const gainNode = audioCtx.createGain();
      const processor = audioCtx.createScriptProcessor(4096, 1, 1);

      source.connect(gainNode);
      gainNode.connect(processor);
      processor.connect(audioCtx.destination);

      processor.onaudioprocess = (e) => {
        const inData = e.inputBuffer.getChannelData(0);
        const outData = e.outputBuffer.getChannelData(0);

        for (let v = 0; v < inData.length; v++) {
          outData[v] = inData[v];
        }

        voice = inData;
      };
    });
  },
};
const man = {
  imgs: [Durden],
  useImageData: true,
  size: 2,
  render(ctx, cw, ch) {
    const { spots = [] } = this.state;
    const imageData = ctx.createImageData(cw, ch);

    imageData.getDataFrom(spots[0], ctx);
  },

  update(ctx, cw, ch) {
    const { spots = [] } = this.state;
    const res = spots[0].slice();
    const { length } = voice;

    const imageData = ctx.createImageData(cw, ch);
    const centerX = cw / 2;

    for (let v = 0; v < res.length; v ++) {
      const item = res[v];
      // item.color[3] = (voice[(item.y * 128) % length] + 0.5) * 255;

      item.x = Math.ceil((centerX - item.x) * (voice[(item.y) % length]) + centerX);
    }

    imageData.getDataFrom(res, ctx);
  },
};

class Music extends Component {
  componentDidMount() {
    this.init();
  }
  init() {
    const res = new Canvas({
      cva: '#canvas',
      list: [man, song],
    });
  }
  render() {
    return (
      <div className="page-canvas-music-render">
        <canvas id="canvas" />
      </div>
    );
  }
}

export default Music;

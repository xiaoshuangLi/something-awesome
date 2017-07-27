import React, { Component } from 'react';

import Durden from './durden.jpg';
import Close from './close.svg';
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
  imgs: [Close],
  useImageData: true,
  size: 3,
  render(ctx, cw, ch) {
    const { spots = [] } = this.state;
    const imageData = ctx.createImageData(cw, ch);

    imageData.getDataFrom(spots[0], ctx);
  },

  update(ctx, cw, ch) {
    const { spots = [], eles = [] } = this.state;
    const res = spots[0];
    const img = eles[0];

    const { height } = img;
    const distance = height / 2;
    const vCenter = ch / 2;
    const { length } = voice;

    const imageData = ctx.createImageData(cw, ch);
    const centerX = cw / 2;

    const { data = [] } = imageData;

    for (let v = 3; v < data.length; v += 4) {
      data[v] = 255;
    }

    for (let v = 0; v < res.length; v ++) {
      const item = res[v];

      let space = Math.abs(item.y - vCenter);
      space = space > distance ? distance : space;
      const index = Math.ceil((space / distance) * (length - 1));
      const times = voice[index] + 1;
      const movePx = Math.ceil(times * 3);

      // const item = Object.assign({}, res[v]);
      // item.color[3] = (voice[(item.y * 128) % length] + 0.5) * 255;

      item.start = item.start || item.x;
      item.target = isHover ? item.start : Math.ceil((item.start - centerX) * times + centerX);
      item.x = item.target > item.x ? (item.x + movePx) : (item.x - movePx);
      item.color = [255, 255, 255, 255];
      res[v] = item;
    }

    imageData.getDataFrom(res, ctx);
  },
};

let isHover = false;

class Music extends Component {
  componentDidMount() {
    this.init();
  }
  init() {
    const res = new Canvas({
      cva: '#canvas',
      list: [man, song],
    });

    res.setCva({
      fillStyle: 'black',
    });
  }
  render() {
    return (
      <div className="page-canvas-music-render">
        <canvas id="canvas" onMouseEnter={() => { isHover = true; }} onMouseLeave={() => { isHover = false; }} />
      </div>
    );
  }
}

export default Music;

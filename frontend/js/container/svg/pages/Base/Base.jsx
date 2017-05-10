import React, { Component } from 'react';

import Key from './key_inline.svg';
import Filter from './filter_inline.svg';

let img = document.querySelector("#test feTurbulence");
let frames = 0;
let rad = Math.PI / 180;
let count = 0;
let res = ''
let time = 8;
let fps = time * 60;

function AnimateBaseFrequency() {
  //baseFrequency="0.01 .1"
  let bfx = 0.01;
  let bfy = .1;
  frames += (360/fps);
  bfx += 0.001 * Math.cos(frames * rad);
  bfy += 0.005 * Math.sin(frames * rad);

  let bf = bfx.toString() + ' ' + bfy.toString();
  document.querySelector("#test feTurbulence").setAttributeNS(null, 'baseFrequency', bf);
  res += (`<filter id="turbulence-${count + 1}" filterUnits="objectBoundingBox">${document.querySelector("#test").innerHTML}</filter>`)
  count ++;

  if(count === fps) {
    console.clear();
    console.log(count);
    console.log(res);
    return;
  }

  AnimateBaseFrequency();
}

// AnimateBaseFrequency();

class Base extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // return (
    //   <div className="page-home-base-render">
    //     <Filter />
    //   </div>
    // );
    
    return (
      <div className="page-home-base-render">
        <Filter className="ng-hide" />

        <div className="top">
          <div className="img"></div>
        </div>
        <div className="bottom no-ani">
          <div className="img"></div>
        </div>
        <div className="bottom">
          <div className="img"></div>
        </div>
      </div>
    );
  }
}

export default Base;

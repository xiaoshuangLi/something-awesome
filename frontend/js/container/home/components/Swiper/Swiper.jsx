import React, { Component } from 'react';

import Ed from './ed.jpeg';
import Cave from './cave.jpeg';
import Sky from './bluesky.jpeg';

class Swiper extends Component {

  render() {
    const list = [
      {img:Ed, title: 'Ed sheeran'}, 
      {img:Cave, title: 'Cave'}, 
      {img:Sky, title: 'Night'}
    ];

    const obj = list.reduce((a, b,i) => {
      a[`data-img-${i}`] = b.img
      a[`data-title-${i}`] = b.title

      return a;
    }, {})

    return (
      <div className={`page-home-swiper-render num-${list.length}`} {...obj}  /> 
    );
  }
}

export default Swiper;

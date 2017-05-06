import React, { Component } from 'react';

import Ed from './ed.jpeg';
import Cave from './cave.jpeg';
import Sky from './bluesky.jpeg';
import Fight from './fight.jpg';

class Swiper extends Component {
  constructor(props){
    super(props);

    this.state = {
      obj: {},
      list: [],
    };
  }

  componentDidMount() {
    const list = [
      {img:Ed, title: 'Ed sheeran'}, 
      {img:Cave, title: 'Cave'}, 
      {img:Fight, title: 'Fight Club'}
    ];

    const obj = list.reduce((a, b,i) => {
      a[`data-img-${i}`] = b.img
      a[`data-title-${i}`] = b.title

      return a;
    }, {})

    this.setState({obj, list})

  }

  render() {

    return (
      <div className={`page-home-swiper-render num-${this.state.list.length}`} {...this.state.obj}  /> 
    );
  }
}

export default Swiper;

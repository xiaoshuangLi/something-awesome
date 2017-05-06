import React, { Component } from 'react';
import Loading from 'js/components/Loading';
import Swiper from '../../components/Swiper';

class Beauty extends Component {

  render() {
    return (
      <div>
        <Loading show={true}>
          <Swiper />
        </Loading>
      </div>
    );
  }
}

export default Beauty;

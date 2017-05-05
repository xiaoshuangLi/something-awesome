import React, { Component } from 'react';
import Loading from 'js/components/Loading';
// import Wave from '../../components/Wave';
// import Sun from '../../components/Sun';
import Swiper from '../../components/Swiper';

class Beauty extends Component {

  render() {
    return (
      <div className="page-home-beauty-render">
        <Loading show={true}>
          <Swiper />
        </Loading>
      </div>
    );
  }
}

export default Beauty;

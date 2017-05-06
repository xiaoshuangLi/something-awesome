import React, { Component } from 'react';
import Loading from 'js/components/Loading';
import Sun from '../../components/Sun';

class Beauty extends Component {

  render() {
    return (
      <div>
        <Loading show={true}>
          <Sun />
        </Loading>
      </div>
    );
  }
}

export default Beauty;

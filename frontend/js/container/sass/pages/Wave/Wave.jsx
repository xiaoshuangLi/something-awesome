import React, { Component } from 'react';
import Loading from 'js/components/Loading';
import Wave from '../../components/Wave';

class Beauty extends Component {

  render() {
    return (
      <div>
        <Loading show={true}>
          <Wave />
        </Loading>
      </div>
    );
  }
}

export default Beauty;

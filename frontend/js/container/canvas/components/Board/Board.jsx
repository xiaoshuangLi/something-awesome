import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

import { timeout } from 'js/common';

import Base from 'js/components/Base';

class Board extends Base {
  aIn(cb) {
    this.getTimeAndCb((time, ele) => {
      ele.classList.add('active');
      timeout(cb, time);
    });
  }

  aOut(cb) {
    this.getTimeAndCb((time, ele) => {
      ele.classList.remove('active');
      timeout(cb, time);
    });
  }

  render() {
    const { className, ...others } = this.props;

    const cls = classnames({
      'components-sass-board-render': true,
      [className]: !!className,
    });

    return (
      <div className={cls} {...others}>
        <div className="board-body" />
        <div className="board-shadow" />
      </div>
    );
  }
}

Board.propTypes = {};
Board.defaultProps = {};

export default Board;

import React, { Component, isValidElement } from 'react';
import { findDOMNode } from 'react-dom';

import { timeout } from 'js/common';

const getEle = (selector) => {
  if (typeof selector === 'string') {
    return document.querySelector(selector);
  }

  return isValidElement(selector) ? findDOMNode(selector) : selector;
};

const getFloat = (num = 0) => {
  num = parseFloat(num);

  return window.isNaN(num) ? 0 : num;
};

const getStyleTime = (style = {}) => {
  let { transitionDuration = 0, animationDuration = 0, transitionDelay = 0, animationDelay = 0 } = style;

  transitionDuration = getFloat(transitionDuration);
  animationDuration = getFloat(animationDuration);
  transitionDelay = getFloat(transitionDelay);
  animationDelay = getFloat(animationDelay);

  const res = (animationDelay + animationDuration) || (transitionDelay + transitionDuration);

  return {
    res,
    transitionDuration,
    animationDuration,
    transitionDelay,
    animationDelay,
  };
};

const getTime = (selector) => {
  const ele = getEle(selector);
  const style = window.getComputedStyle(ele);
  const res = getStyleTime(style);

  return res;
};

const createDefaultProps = (obj = {}) => {
  return Object.assign({}, { ready: false }, obj);
};

class Base extends Component {
  constructor(props) {
    super(props);

    this.closeComponent = this.closeComponent.bind(this);
  }

  componentDidMount(cb) {
    this.props.ready && this.aIn(cb);
  }

  getTimeAndCb(cb) {
    const ele = this.ele || findDOMNode(this);
    const obj = this.obj || getTime(ele);
    const { res } = obj;

    cb(res * 1000, ele, obj);
  }

  aIn(cb) {
    this.getTimeAndCb((time) => {
      timeout(cb, time);
    });
  }

  aOut(cb) {
    this.getTimeAndCb((time) => {
      timeout(cb, time);
    });
  }

  closeComponent(cb) {
    this.aOut(cb);
  }

  componentWillEnter(cb) {
    !this.props.ready && this.aIn(cb);
  }

  componentWillAppear(cb) {
    !this.props.ready && this.aIn(cb);
  }

  componentWillDisappear(cb) {
    !this.props.ready && this.aIn(cb);
  }

  componentWillLeave(cb) {
    !this.props.ready && this.aOut(cb);
  }

  componentDidEnter() {
    const { onDidEnter } = this.props;
    onDidEnter && onDidEnter();
  }

  componentDidLeave() {
    const { onDidLeave } = this.props;
    onDidLeave && onDidLeave();
  }

  render() {
    return (
      <div>{this.props.children || null}</div>
    );
  }
}

Base.defaultProps = createDefaultProps();
Base.createDefaultProps = createDefaultProps;
Base.getTime = getTime;

export default Base;

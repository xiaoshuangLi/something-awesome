import React, { Component, PropTypes, cloneElement } from 'react';

class Form extends Component {
  constructor(props) {
    super(props);

    this.setResult = this.setResult.bind(this);
  }

  onChange(result) {
    if(!this.props.onChange) {
      return null;
    }

    result = result || this.getResult();
    this.props.onChange(result.res, result.validate)
  }

  onBlur(result) {
    if(!this.props.onBlur) {
      return null;
    }

    result = result || this.getResult();
    this.props.onBlur(result.res, result.validate)
  }

  getResult() {
    const { result } = this;
    const keys = Object.keys(result);

    let res = {};
    let validate = true;

    for(let v = 0; v < keys.length; v++) {
      const key = keys[v];

      res[key] = result[key]['value'];
      validate = result[key]['validate'] ? validate : false;
    }

    return {
      res,
      validate,
    };
  }

  callAfterSet(){
    const { onChange, onBlur } = this.props;

    if(!onChange && !onBlur) {
      return null;
    }

    const result = this.getResult();
    this.onChange(result);
    this.onBlur(result);
  }

  setResult(value, validate, key) {
    this.result = this.result || {};
    this.result[key] = {
      value,
      validate,
    };

    this.callAfterSet();
  }
  
  // 子组件传入修改之后的回调
  getChildren() {
    const { setResult } = this;

    return this.props.children.map((child, index) => {
      return cloneElement(child, {
        setResult,
        key: index,
      });
    });
  }

  render() {
    return (
      <span>
        { this.getChildren() }
      </span>
    );
  }
}

export default Form;
import React, { Component, PropTypes, cloneElement } from 'react';

import * as validateFuncs from './validate';

const typeValidateAttrs = {
  number: ['min', 'max', 'required'],
  bool: ['required'],
  string: ['minLength', 'maxLength', 'pattern', 'required'],
  all: ['min', 'max', 'minLength', 'maxLength', 'pattern', 'required'],
};

class Input extends Component {

  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  _validate(value) {
    const { type = 'all', func } = this.props;
    const attrs = typeValidateAttrs[type] || [];

    for(let v = 0; v < attrs.length; v++) {
      const attr = attrs[v];
      const args = this.props[attr];

      if(!validateFuncs[attr]) {
        console.log(attr)
      }

      const validateFunc = validateFuncs[attr](args);

      if(!validateFunc(value)) {
        return false;
      }
    }

    if(func !== undefined) {
      return func(value);
    }

    return true;
  }

  _getValue(e) {
    e = e.target || e;
    const value = e.value === undefined ? e : e.value;

    this.setState({ value });
    return value;
  }

  onChange(e) {
    const { onChange, setResult, name } = this.props;

    if(!onChange) {
      return null;
    }

    const value = this._getValue(e);
    const res = this._validate(value);

    onChange && onChange(value, res);
    setResult && setResult(value, res, name);
  }

  onBlur(e) {
    const { onBlur, setResult, name } = this.props;

    if(!onBlur) {
      return null;
    }

    const value = this._getValue(e);
    const res = this._validate(value);

    onBlur && onBlur(value, res);
    setResult && setResult(value, res, name);
  }

  getChildren() {
    const { onChange, onBlur, props } = this;
    const { children } = props;

    return React.Children.map(children, (child) => {
      return cloneElement(child, {
        onChange,
        onBlur,
      });
    });
  }

  render() {
    return (
      <span>
        {this.getChildren()}
      </span>
    );
  }
}

export default Input;
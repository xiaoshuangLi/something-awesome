class Base {
  setState(obj, cb) {
    const { state = {} } = this;
    this.state = Object.assign({}, state, obj);

    cb && cb();
  }
}

export default Base;

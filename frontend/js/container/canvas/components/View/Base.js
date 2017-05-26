class Base {
  setState(obj, cb) {
    const { state = {} } = this;
    this.state = Object.assign({}, state, obj);
  }
}

export default Base;

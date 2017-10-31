const getIfFunc = (res) => {
  res = typeof res === 'function' ? { func: res } : res;

  return res;
};

const animate = func => () => {
  let id;

  function run() {
    id && window.cancelAnimationFrame(id);

    if (!func()) {
      return null;
    }

    id = window.requestAnimationFrame(run);
  }

  run();
};


class Animate {
  constructor(props) {
    this.state = getIfFunc(props);
    this.setAnimate();
  }
  
  setState(obj = {}, cb) {
    const { state = {} } = this;

    Object.assign(state, obj);
    cb && cb(state);
  }

  setAnimate(obj = {}) {
    obj = getIfFunc(obj);

    this.setState(obj, this.setAnimateFromState);
  }

  setAnimateFromState = (state = this.state) => {
    this.animate = animate(() => {
      state.func && state.func();

      return state.runing;
    });

    state.runing && this.start();
  }

  start() {
    this.setState({
      runing: true,
    }, this.animate);
  }

  stop() {
    this.setState({ runing: false });
  }
}

export default Animate;

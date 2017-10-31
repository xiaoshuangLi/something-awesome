const getIfFunc = (res) => {
  res = typeof res === 'function' ? { func: res } : res;

  return res;
};

const animate = func => (...list) => {
  let id;

  function run() {
    id && window.cancelAnimationFrame(id);

    if (!func(...list)) {
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

  setState(obj = {}) {
    const { state = {} } = this;

    return Promise.resolve(
      Object.assign(state, obj)
    );
  }

  setAnimate(obj = {}) {
    this.setState(
      getIfFunc(obj)
    ).then(() => this.setAnimateFromState());
  }

  setAnimateFromState(state = this.state) {
    this.animate = animate(() => {
      state.func && state.func();

      return state.runing;
    });

    state.runing && this.start();
  }

  start() {
    this.setState({
      runing: true,
    }).then(() => this.animate());
  }

  stop() {
    this.setState({ runing: false });
  }
}

export default Animate;

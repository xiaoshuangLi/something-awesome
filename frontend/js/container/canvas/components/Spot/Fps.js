class Fps {
  constructor(props) {
    this.state = {
      stop: false,
      curr: 0,
      index: 0,
      order: props.order || 1,
      speed: props.speed,
      freeze: props.freeze,
      list: props.list,
      cb: props.cb,
    };

    this.state.cb = this.state.cb.bind(this);

    this.init();
  }

  setState(obj) {
    const { state = {} } = this;
    this.state = Object.assign({}, state, obj);
  }

  count() {
    const { fps, stopFps, stop } = this.state;
    let { curr } = this.state;

    curr++;

    if (!stop && curr === fps) {
      this.state.stop = true;
      this.state.index++;
    }

    this.state.curr = curr % (this.state.stop ? stopFps : fps);

    if (stop && curr === stopFps) {
      this.state.stop = false;
    }
  }

  update() {
    window.requestAnimationFrame(() => {
      this.count();

      const { list, stop, curr, index, fps, cb, order } = this.state;

      if (stop) {
        return this.update();
      }

      const step = (curr + 1) / fps;
      const currIndex = index % order;

      for (let v = 0; v < list.length; v++) {
        list[v].update(step, currIndex);
      }

      cb && cb(list);
      this.update();
    });
  }

  render() {
    const { list } = this.state;

    for (let v = 0; v < list.length; v++) {
      list[v].render();
    }
  }

  init() {
    this.setState({
      fps: this.state.speed * 60,
      stopFps: this.state.freeze * 60,
    });

    this.render();
    this.update();
  }
}

export default Fps;

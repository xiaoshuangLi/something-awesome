const _calc = (a, b, step) => {
  return Math.ceil(a + (b - a) * step);
};

class Spot {
  constructor(props) {
    this.state = {
      ctx: props.ctx,
      list: props.list || [],
      length: 0,
    };

    this.init();
  }

  setState(obj) {
    const { state = {} } = this;
    this.state = Object.assign({}, state, obj);
  }

  update(step, index) {
    const { list = [], length } = this.state;

    const spot = list[index];
    const target = list[(index + 1) % length];

    this.res = {
      x: _calc(spot.x, target.x, step),
      y: _calc(spot.y, target.y, step),
      color: [_calc(spot.color[0], target.color[0], step), _calc(spot.color[1], target.color[1], step), _calc(spot.color[2], target.color[2], step), _calc(spot.color[3], target.color[3], step)],
    };
  }

  render() {
    this.update(0, 0);
  }

  init() {
    let { list } = this.state;
    const { length = 1 } = list;

    list = list.map((item, i) => {
      const next = list[(i + 1) % length] || {};
      return item || {
        x: next.x || 0,
        y: next.y || 0,
        color: [0, 0, 0, -255 * 6],
      };
    });

    this.setState({
      list,
      length: list.length,
    });
  }
}

export default Spot;

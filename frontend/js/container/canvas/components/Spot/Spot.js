class Spot {
  constructor(props) {
    this.state = {
      ctx: props.ctx,
      list: props.list || [],
    };

    this.calc = this.calc.bind(this);
    this.init();
  }

  setState(obj) {
    const { state = {} } = this;
    this.state = Object.assign({}, state, obj);
  }

  calc(a, b, step) {
    return Math.ceil(a + (b - a) * step);
  }

  update(step, index) {
    const { list = [] } = this.state;
    const { calc } = this;

    const spot = list[index];
    const target = list[(index + 1) % list.length];

    this.res = {
      x: calc(spot.x, target.x, step),
      y: calc(spot.y, target.y, step),
      color: [calc(spot.color[0], target.color[0], step), calc(spot.color[1], target.color[1], step), calc(spot.color[2], target.color[2], step), calc(spot.color[3], target.color[3], step)],
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
        color: [0,0,0, -255 * 3],
      };
    });

    this.setState({
      list,
    });
  }
}

export default Spot;
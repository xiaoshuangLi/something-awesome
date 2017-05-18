import { timeout } from 'js/common';

class Spot {
  constructor(props) {
    this.state = {
      index: 0,
      curr: 0,
      stop: false,
      freeze: props.freeze || 1,
      speed: props.speed || 1,
      ctx: props.ctx,
      list: props.list || [],
    }

    this.calc = this.calc.bind(this);

    this.init();
  }

  setState(obj){
    const { state = {} } = this;
    this.state = Object.assign({}, state, obj);
  }

  count() {
    const { fps, list = [], freeze } = this.state;
    let { curr = 0, index } = this.state;

    curr++;

    if (Number(curr === fps)) {
      timeout(() => {
        this.setState({ stop: false })
      }, freeze * 1000);

      this.setState({ stop: true })
    }

    index += Number(curr === fps);
    index = index%list.length;
    curr = curr%fps;

    this.setState({
      curr,
      index,
    });
  }

  draw(spot, noMore) {
    const { ctx, list = [] } = this.state;

    ctx.fillStyle = `rgba(${spot.color[0]}, ${spot.color[1]}, ${spot.color[2]}, ${spot.color[3]})`;

    ctx.beginPath();
    ctx.arc(spot.x,spot.y,1,0,2*Math.PI);
    ctx.fill();

    !noMore && this.count();
  } 

  calc(a, b) {
    const { curr, fps } = this.state;
    const per = curr/fps;

    return Math.floor(a + (b - a)*per);
  }

  update(cb) {
    const { curr = 0, index = 0, list = [], stop } = this.state;
    const { calc } = this;

    if (stop) {
      return cb && cb(list[index]);
    } 

    const spot = list[index];
    const target = list[(index + 1)%list.length];

    const res = {
      x: calc(spot.x, target.x),
      y: calc(spot.y, target.y),
      color: [calc(spot.color[0], target.color[0]), calc(spot.color[1], target.color[1]), calc(spot.color[2], target.color[2]), calc(spot.color[3], target.color[3])],
    };

    this.count();

    cb && cb(res);
  }

  render() {
    const { index, ctx, list = [] } = this.state;

    if (!ctx || !list.length) {
      return null;
    }

    this.draw(list[index], true);
  }

  init() {
    const { speed } = this.state;
    let { list } = this.state;
    const { length = 1 } = list;

    list = list.map((item, i) => {
      const next = list[(i + 1) % length] || {};
      return item || {
        x: next.x || 0,
        y: next.y || 0,
        color: [0,0,0, -3],
      }
    });

    this.setState({
      list,
      fps: 60 * speed,
    })
  }
}

export default Spot;
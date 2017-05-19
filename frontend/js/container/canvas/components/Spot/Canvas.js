import { getEles, loadAll } from 'js/common';

import Spot from './Spot';
import Fps from './Fps';

// const window = window || {
//   devicePixelRatio: 1,
// };

// const document = document || {
//   body: {
//     clientWidth: 0,
//     clientHeight: 0,
//   },
// };

function _getNum(num = 0, w = 0) {
  const reg = /\d%/;
  num = reg.test(num) ? w  * parseFloat(num)/100 : parseFloat(num);

  return isNaN(num) ? 0 : num;
}

function _validColor(curr, target) {
  for(let v = 0; v < 3; v ++ ){
    if (curr[v] !== target[v]) {
      return false;
    }
  }

  return target[3] === undefined ? true : target[3] === curr[3];
}

function _validList(curr, list, val = true) {
  if (!list.length) {
    return val;
  }

  for(let v = 0; v < list.length; v ++ ) {
    const item = list[v];

    if (!_validColor(curr, item)) {
      return false;
    }
  }

  return true;
}

function _valid(curr, include = [], exclude = []) {
  if (!include.length && !exclude.length) {
    return true;
  }

  if (!_validList(curr, include)) {
    return false;
  }

  if (_validList(curr, exclude, false)) {
    return false;
  }

  return true;
}

class Canvas {
  constructor(props) {
    this.state = {
      w: props.w,
      h: props.h,
      cva: props.cva,
      speed: props.speed || 1,
      freeze: props.freeze || 1,
      max: props.max || 400,
      imgs: props.imgs || [],
      order: props.order || 3,
      exclude: props.exclude || [[255, 255, 255]],
      include: props.include || [],
      ratio: window.devicePixelRatio,
    };

    this.action = this.action.bind(this);
    this.getSopts = this.getSopts.bind(this);

    this.init();
  }

  setCva(obj) {
    const { ctx } = this.state;

    Object.keys(obj).forEach((key) => {
      const val = obj[key];

      switch (typeof val) {
        case 'string':
          ctx[key] = val;
          break;
        case 'function':
          val(ctx);
          break;
      }
    });

    return ctx;
  }

  setState(obj) {
    const { state = {} } = this;
    this.state = Object.assign({}, state, obj);
  }

  getAttr() {
    let { cva, w, h } = this.state;
    const { ratio } = this.state;

    cva = typeof cva === 'string' ? getEles(cva)[0] : cva;

    const parent = cva.parentNode;

    w = w || parent.clientWidth || document.body.clientWidth;
    h = h || parent.clientHeight || document.body.clientHeight;

    const cw = w * ratio;
    const ch = h * ratio;

    cva.setAttribute('width', `${cw}px`);
    cva.setAttribute('height', `${ch}px`);

    cva.style.width = `${w}px`;
    cva.style.height = `${h}px`;

    const ctx = cva.getContext('2d');

    this.setState({
      cva,
      ctx,
      w,
      h,
      cw,
      ch,
    });
  }

  getImgs(cb) {
    const { imgs = [], cw, ch, max, ctx } = this.state;
    const maxWidth = _getNum(max, cw);

    let list = [];

    loadAll(imgs, res => {
      list = res.map(img => {
        let { width, height } = img;

        if (width >= maxWidth) {
          height = Math.floor(height * maxWidth/width);
          width = maxWidth;
        }

        const x = (cw - width)/2;
        const y = (ch - height)/2;

        ctx.drawImage(img, x, y, width, height);
        return ctx.getImageData(x, y, width, height);
      });

      ctx.clearRect(0, 0, cw, ch);
      cb && cb(list);
    });
  }

  getSopts(res) {
    const { width, height } = res;
    const { cw, ch, exclude, include, order, ratio } = this.state;

    let color = [];
    const colors = [];
    const spots = [];

    res.data.forEach((val, i) => {
      color[i%4] = val;
      i += 1;
      if (i % 4 === 0 && color.length) {
        colors.push(color);
        color = [];
      }
    });

    colors.forEach((item, i) => {
      const y = Math.ceil((i + 1) / width);

      if (y % order !== 0) {
        return null;
      }

      const x = i - (y - 1) * width;

      if (x % order !== 0 || x * y === 0) {
        return null;
      }

      if (!_valid(item, include, exclude)) {
        return null;
      }

      spots.push({
        color: item,
        x: x + (cw - width)/2,
        y: y + (ch - height)/2,
      });
    });

    return spots;
  }

  update(spots) {
    const { ctx, freeze, speed, cw, ch } = this.state;
    const res = new Fps({
      freeze,
      speed,
      list: spots,
      order: 2,
      cb: (list = []) => {
        ctx.clearRect(0, 0, cw, ch);
        const imgData = ctx.createImageData(cw, ch);
        const spotsTotal = list.length;

        for (let a = 0; a < spotsTotal; a++) {
          const spot = list[a];
          const { x, y, color = {} } = spot.res;
          const start = (x + (y - 1) * cw) * 4;

          for (let v = 0; v < 4; v++) {
            const curr = start + v;
            imgData.data[curr] = imgData.data[curr] || color[v] || 0;
          }
        }

        ctx.putImageData(imgData, 0, 0);
      },
    });
  }

  action(list = []) {
    const { ctx, freeze, speed } = this.state;

    if (!list.length) {
      return null;
    }

    list = list.map(this.getSopts);
    const total = Math.max.apply(null, list.map(item => item.length));
    const spots = [];

    for (let v = 0; v < total; v++) {
      const spot = list.map(item => item[v]);
      spots.push(new Spot({
        list: spot,
        ctx,
        freeze,
        speed,
      }));
    }

    this.update(spots);
  }

  init() {
    this.getAttr();
    this.getImgs(this.action);
  }
}

export default Canvas;

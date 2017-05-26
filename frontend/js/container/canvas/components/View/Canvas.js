import { getEles } from 'js/common';

import { getPiexl } from './func';
import Base from './Base';
import Part from './Part';

ImageData.prototype.from = function (list = [], ctx) {
  const self = this;
  const { width, data } = self;

  const pixels = getPiexl({ list, width });
  const { length } = pixels;

  for (let v = 0; v < length; v++) {
    const { index, value } = pixels[v];

    data[index] = data[index] || value;
  }

  ctx.putImageData(self, 0, 0);
};

class Canvas extends Base {
  constructor(props) {
    super(props);

    this.state = {
      w: props.w,
      h: props.h,
      cva: props.cva,
      ratio: window.devicePixelRatio,
      list: props.list || [],
    };

    this.action = this.action.bind(this);

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

  setList() {
    const { ratio, cw, ch, w, h, ctx } = this.state;

    const opts = {
      ratio,
      cw,
      ch,
      w,
      h,
      ctx,
    };

    this.state.list = this.state.list.map((item, order) => {
      return new Part(Object.assign({ order }, opts, item));
    });
  }

  update() {
    const { list = [], ctx, cw, ch, ratio, w, h } = this.state;

    window.requestAnimationFrame(() => {
      const loads = [];

      for (let v = 0; v < list.length; v++) {
        const item = list[v];

        item.update && loads.push(item.update(ctx, cw, ch, ratio, w, h));
      }

      Promise.all(loads).then(() => {
        this.update();
      });
    });
  }

  action() {
    const { list = [], ctx, cw, ch, ratio, w, h } = this.state;
    const loads = [];

    for (let v = 0; v < list.length; v++) {
      const item = list[v];

      item._partLoad && loads.push(item._partLoad());
    }

    Promise.all(loads).then(() => {
      list.forEach((item) => {
        item.render && item.render(ctx, cw, ch, ratio, w, h);
      });

      this.update();
    });
  }

  init() {
    this.getAttr();
    this.setList();
    this.action();
  }
}

export default Canvas;

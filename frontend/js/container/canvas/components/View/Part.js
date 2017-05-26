import { loadAll } from 'js/common';

import Base from './Base';
import GetSpotsJS from './getSpots_inline';

const getSpotsWorker = new Worker(GetSpotsJS);

const postMessage = (data) => {
  getSpotsWorker.postMessage(data);
};

const reveive = (cb) => {
  getSpotsWorker.onmessage = (e) => {
    cb && cb(e.data);
  };
};

const defaultState = {
  useImageData: false,
  size: 1,
  exclude: [[255, 255, 255], [0, 0, 0, 0]],
  include: [],
  imgs: [],
};

class Part extends Base {
  constructor(props = {}) {
    super(props);

    const keys = Object.keys(props);
    const { length } = keys;
    const state = {};

    for (let v = 0; v < length; v++) {
      const key = keys[v];
      const value = props[key];

      switch (typeof value) {
        case 'function': {
          this[key] = value.bind(this);
          break;
        }

        default: {
          state[key] = value;
          break;
        }
      }
    }

    this.state = Object.assign({}, defaultState, state);
    this._partAddFuncs(this._partGetSpots);
    this.init && this.init();
  }

  _partGetSpots() {
    return new Promise((resolve) => {
      if (!this.state.useImageData) {
        return resolve();
      }

      const { ctx, eles = [], cw = 0, ch = 0, exclude, include, size } = this.state;
      const list = eles.map((img) => {
        ctx.clearRect(0, 0, cw, ch);
        let { width, height } = img;

        if (width >= cw) {
          height = Math.floor(height * cw / width);
          width = cw;
        }

        const x = (cw - width) / 2;
        const y = (ch - height) / 2;

        ctx.drawImage(img, x, y, width, height);
        return ctx.getImageData(x, y, width, height);
      });
      ctx.clearRect(0, 0, cw, ch);

      reveive((spots) => {
        this.setState({
          spots,
        });

        resolve();
      });

      postMessage({
        imageData: list,
        opts: {
          cw,
          ch,
          exclude,
          include,
          size,
        },
      });
    });
  }

  _partAddFuncs(list, cb) {
    const { _partFuncs = [] } = this;

    list = (list instanceof Array) ? list : [list];
    list = list.map(item => item.bind(this));

    this._partFuncs = _partFuncs.concat(list);
    cb && this._partRefresh(cb);
  }

  _partRefresh(cb) {
    const loads = this._partFuncs.map(func => func());
    Promise.all(loads).then(cb);
  }

  _partLoad() {
    const { imgs = [], useImageData } = this.state;

    return new Promise((resolve) => {
      loadAll(imgs, (eles) => {
        this.setState({ eles });

        if (!useImageData) {
          return resolve();
        }

        this._partRefresh(resolve);
      });
    });
  }
}

export default Part;

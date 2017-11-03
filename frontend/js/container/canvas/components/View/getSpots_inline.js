function _validColor(curr, target) {
  for (let v = 0; v < 3; v ++ ) {
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

  for (let v = 0; v < list.length; v++) {
    const item = list[v];

    if (_validColor(curr, item)) {
      return true;
    }
  }

  return false;
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

function getSopts({ imageData = {}, opts = {} } = {}) {
  const { cw, ch, exclude = [], include = [], size = 1 } = opts;
  const { width, height, data = [] } = imageData;

  let color = [];
  const colors = [];
  const spots = [];

  data.forEach((val, i) => {
    color[i%4] = val;
    i += 1;
    if (i % 4 === 0 && color.length) {
      colors.push(color);
      color = [];
    }
  });

  colors.forEach((item, i) => {
    const y = Math.ceil((i + 1) / width);

    if (y % size !== 0) {
      return null;
    }

    const x = i - (y - 1) * width;

    if (x % size !== 0 || x * y === 0) {
      return null;
    }

    if (!_valid(item, include, exclude)) {
      return null;
    }

    spots.push({
      color: item,
      x: x + Math.floor((cw - width) / 2),
      y: y + Math.floor((ch - height) / 2),
    });
  });

  return spots;
}

onmessage = (e) => {
  const { data = {} } = e;
  const list = data.imageData.map((item) => {
    return getSopts({
      imageData: item,
      opts: data.opts,
    });
  });

  const length = list.length;
  const total = Math.max.apply(null, list.map(item => item.length));

  for (let v = 0; v < total; v++) {
    list.forEach((item, i) => {
      if (item[v]) {
        return null;
      }

      const next = list[(i + 1) % length][v] || {};
      item[v] = {
        x: next.x || 0,
        y: next.y || 0,
        color: [0, 0, 0, -255 * 6],
      };
    });
  }

  postMessage(list);
};

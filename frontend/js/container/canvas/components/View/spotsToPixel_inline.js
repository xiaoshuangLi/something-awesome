function getPiexl({ list = [], width = 0 } = {}) {
  const { length } = list;
  const data = [];

  for (let v = 0; v < length; v++) {
    const item = list[v];
    const { x, y, color = [] } = item;

    const total = color.length;
    const start = (x + (y - 1) * width) * 4;

    for (let a = 0; a < total; a++) {
      data.push({
        index: start + a,
        value: color[a],
      });
    }
  }

  return data;
}

onmessage = (e) => {
  const { data = {} } = e;

  postMessage(getPiexl(data));
};

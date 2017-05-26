const _calc = (a, b, step) => {
  return Math.ceil(a + (b - a) * step);
};

onmessage = (e) => {
  const { data = {} } = e;
  const { from = [], to = [] , curr } = data;

  const { length } = from;
  const res = from.map((fromItem, i) => {
    const toItem = to[i];

    const fromColor = fromItem.color || [];
    const toColor = toItem.color || [];

    return {
      x: _calc(fromItem['x'], toItem['x'], curr),
      y: _calc(fromItem['y'], toItem['y'], curr),
      color: [_calc(fromColor[0], toColor[0], curr),_calc(fromColor[1], toColor[1], curr),_calc(fromColor[2], toColor[2], curr),_calc(fromColor[3], toColor[3], curr),]
    };
  });

  postMessage(res)
}
import Raven from 'js/components/Raven';

import Soul from './Soul';

const normals = new Float32Array([
  0, 0, -1,
  0, 0, -1,
  0, 0, -1,
  0, 0, -1,
  -1, 0, 0,
  -1, 0, 0,
  -1, 0, 0,
  -1, 0, 0,
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,
  1, 0, 0,
  1, 0, 0,
  1, 0, 0,
  1, 0, 0,
  0, -1, 0,
  0, -1, 0,
  0, -1, 0,
  0, -1, 0,
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,
]);

const getRectangleIndex = (i1, i2, i3, i4) => {
  return [
    i2, i1, i4,
    i3, i4, i1,
  ];
};

const concatFunc = (items = [], points = []) => {
  let res = [];

  items.forEach((item = 0) => {
    res = res.concat(points[item]);
  });

  return res;
};

class Cube extends Soul {
  constructor(props = {}) {
    super(props);

    this.update(Object.assign({}, props, { normals }));
  }

  calc() {
    const { w = 0, h = 0, l = 0, color = [1.0, 1.0, 1.0, 1.0] } = this.data;
    const constants = [w, h, l];
    const { length = 1 } = constants;

    const points = [
      [0, 0, 0],
      [0, h, 0],
      [w, 0, 0],
      [w, h, 0],
      [0, 0, l],
      [0, h, l],
      [w, 0, l],
      [w, h, l],
    ];

    const cubePoints = [
      ...concatFunc([1, 0, 3, 2], points),
      ...concatFunc([0, 1, 4, 5], points),
      ...concatFunc([1, 3, 5, 7], points),
      ...concatFunc([3, 2, 7, 6], points),
      ...concatFunc([2, 0, 6, 4], points),
      ...concatFunc([4, 5, 6, 7], points),
    ];

    const positions = cubePoints.map((p, i) => {
      const curr = constants[i % length] / 2;
      const res = p - curr;

      return res;
    });

    let indices = [];
    let colors = [];

    for (let v = 0; v < positions.length / 3; v += 1) {
      colors = colors.concat(color);

      if (v % 4 === 0) {
        const min = v;

        indices = indices.concat(getRectangleIndex(min, min + 1, min + 2, min + 3));
      }
    }

    this.indices = indices;
    this.colors = colors;
    this.positions = positions;
  }
}

export default Cube;

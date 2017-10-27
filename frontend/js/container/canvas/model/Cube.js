import { patchAttributes, setIndexBuffer } from '../common/base';

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

class Cube {
  constructor(props = {}) {
    this.colors = [];
    this.normals = normals;
    this.positions = [];
    this.indexs = [];

    this.update(props);
  }

  update(data = {}) {
    this.data = data;

    this.calc();
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

    const cubePoints = new Float32Array([
      ...concatFunc([1, 0, 3, 2], points),
      ...concatFunc([0, 1, 4, 5], points),
      ...concatFunc([1, 3, 5, 7], points),
      ...concatFunc([3, 2, 7, 6], points),
      ...concatFunc([2, 0, 6, 4], points),
      ...concatFunc([4, 5, 6, 7], points),
    ]);

    const positions = cubePoints.map((p, i) => {
      const curr = constants[i % length] / 2;
      const res = p - curr;

      return res;
    });

    let indexs = [];
    let colors = [];

    for (let v = 0; v < positions.length / 3; v += 1) {
      colors = colors.concat(color);

      if (v % 4 === 0) {
        const min = v;

        indexs = indexs.concat(getRectangleIndex(min, min + 1, min + 2, min + 3));
      }
    }

    colors = new Float32Array(colors);
    indexs = new Int16Array(indexs);

    this.indexs = indexs;
    this.colors = colors;
    this.positions = positions;
  }

  render(gl, program, obj = {}) {
    const { pName = 'a_position', NName = 'a_normal', cName = 'a_color' } = obj;

    patchAttributes(gl, program, {
      [pName]: {
        data: this.positions,
        args: [3, gl.FLOAT, false, 0, 0],
      },
      [NName]: {
        data: this.normals,
        args: [3, gl.FLOAT, false, 0, 0],
      },
      [cName]: {
        data: this.colors,
        args: [4, gl.FLOAT, false, 0, 0],
      },
    });

    setIndexBuffer(gl, {
      data: this.indexs,
    });

    gl.drawElements(gl.TRIANGLES, this.indexs.length, gl.UNSIGNED_SHORT, 0);
  }
}

export default Cube;

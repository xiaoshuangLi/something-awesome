import 'three';

import Soul from './Soul';

const getRectangleIndex = (i1 = 0, i2 = 1, i3 = 2, i4 = 3) => {
  return [
    i1, i3, i4,
    i4, i2, i1,
  ];
};

class Rect extends Soul {
  constructor(props) {
    super(props);

    this.update(props);
  }

  _getPoints() {
    const { w = 0, h = 0 } = this.data;
    const constants = [w, h];
    const { length = 1 } = constants;

    const points = [
      [0, 0, 0],
      [0, h, 0],
      [w, 0, 0],
      [w, h, 0],
    ];

    points.forEach((p, i) => {
      const curr = constants[i % length] / 2;
      const res = p - curr;

      return res;
    });

    return points;
  }

  _getColors() {
    const { color = [] } = this.data;
    
    let colors = [];

    for (let v = 0; v < 4; v += 1) {
      colors = colors.concat(color);
    }

    return colors;
  }

  _getNormals(data = {}) {
    const { x, y ,z } = data;
    const normal = [x, y , z];
    
    let normals = []

    for (let v = 0; v < 4; v += 1) {
      normals = normals.concat(normal);
    }

    return normals;
  }

  calc() {
    const points = this._getPoints();
    const [p1, p2, p3] = points;

    const c1 = new THREE.Vector3(...p1);
    const c2 = new THREE.Vector3(...p2);
    const c3 = new THREE.Vector3(...p3);

    const v1 = c1.sub(c2);
    const v2 = c2.sub(c3);

    const normal = v2.cross(v1).normalize();

    const normals = this._getNormals(normal);
    const colors = this._getColors();
    const indices = getRectangleIndex();
    const positions = points.reduce((a, b) => { return a.concat(b) }, []);

    this.colors = colors;
    this.indices = indices;
    this.positions = positions;
    this.normals = normals;
  }
}

export default Rect;

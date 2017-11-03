import 'three';

import Cube from 'js/container/canvas/model/Cube';
import Rect from 'js/container/canvas/model/Rect';

const star = new Rect({
  w: 5,
  h: 5,
  color: [0.6, 0.6, 0.6, 0.98],
});

const rYA = new THREE.Vector3(1, 1, 0).normalize();
const rZA = new THREE.Vector3(0, 0, 1);

const save = {};

const starMats = [
  (now) => {
    if (now === save.now && save.mat) {
      return save.mat;
    }

    save.now = now;
    save.mat = new THREE.Matrix4().makeRotationAxis(rYA, now * 3);

    return save.mat;
  },
];

const max = 2000;
const r = 1500;

const stars = {
  children: [],
};

const createStars = () => {

  for (let v = 0; v <= max; v += 1) {
    const ranY = Math.random() * Math.PI;
    const ranZ = Math.random() * Math.PI * 2;
    const degY = ranY;
    const degZ = ranZ;

    const sY = Math.sin(degY);
    const cY = Math.cos(degY);

    const xy = r * cY;
    const sZ = Math.sin(degZ);
    const cZ = Math.cos(degZ);

    const mat = new THREE.Matrix4().makeTranslation(xy * sZ, r * sY, -xy * cZ);

    mat.multiply(new THREE.Matrix4().makeRotationAxis(rZA, Math.PI / 4));
    mat.multiply(new THREE.Matrix4().makeRotationAxis(rYA, Math.random() * Math.PI * 2));

    const res = {
      mats: [mat, ...starMats],
      models: [star],
    };

    stars.children.push(res);
  }
};

createStars();

export default stars;

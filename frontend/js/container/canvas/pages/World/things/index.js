import 'three';

import Cube from 'js/container/canvas/model/Cube';

import stars from './stars';
import desk from './desk';
import meteors from './meteors';
import birds from './birds';


const floor = new Cube({
  w: 10000,
  h: 0,
  l: 10000,
  color: [0.12, 0.1, 0.1, 1.0],
});

const things = {
  baseMat: new THREE.Matrix4().makeTranslation(0, -65, 0),
  models: [floor],
  children: [desk, stars, meteors, birds],
};

export default things;

import 'three';

import Cube from 'js/container/canvas/model/Cube';

import stars from './stars';
import desk, { screenViewMat, screenHeight} from './desk';
import meteors from './meteors';
import birds from './birds';

const floor = new Cube({
  w: 10000,
  h: 0,
  l: 10000,
  color: [0.12, 0.1, 0.1, 1.0],
});

const thingsBaseMat = new THREE.Matrix4().makeTranslation(0, -65, 0);
const screenMat = thingsBaseMat.clone().multiply(screenViewMat);

const things = {
  baseMat: thingsBaseMat,
  models: [floor],
  children: [desk, stars, meteors, birds],
};

export { screenMat, screenHeight};
export default things;

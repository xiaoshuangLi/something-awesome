import Cube from '../../model/Cube';

const table = new Cube({
  w: 120,
  h: 2,
  l: 65,
  color: [0.85, 0.85, 0.85, 1.0],
});

const tableLeg = new Cube({
  w: 5,
  h: 60,
  l: 5,
  color: [0.85, 0.85, 0.85, 1.0],
});

const macPlane = new Cube({
  w: 30,
  h: 1,
  l: 22,
  // color: [0.7, 0.7, 0.7, 1.0],
  color: [0.7, 0.7, 0.7, 1.0],
});

const keyBoard = new Cube({
  w: 26,
  h: 0,
  l: 14,
  color: [0.2, 0.2, 0.2, 1.0],
});

const macScreen = new Cube({
  w: 28,
  h: 0,
  l: 20,
  color: [0.2, 0.2, 0.2, 1.0],
});

const screenContainer = new Cube({
  w: 36,
  h: 60,
  l: 3,
  color: [0.6, 0.6, 0.6, 1.0],
});

const screen = new Cube({
  w: 32,
  h: 56,
  l: 0,
  color: [0.2, 0.2, 0.2, 1.0],
});

const baseTree = {
  mats: [
    // now => new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 1, 0).normalize(), THREE.Math.degToRad(now * 100)),
  ],
  baseMat: new THREE.Matrix4().makeTranslation(0, 0, -50),
  models: [table],
  children: [
    {
      mats: [
        new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 1, 0), THREE.Math.degToRad(10)),
        new THREE.Matrix4().makeTranslation(-15, 1, 5),
      ],
      models: [macPlane],
      children: [
        {
          mats: [
            new THREE.Matrix4().makeTranslation(0, 10, -16.5),
            new THREE.Matrix4().makeRotationX(45),
          ],
          models: [macPlane],
          children: [
            {
              mats: [
                new THREE.Matrix4().makeTranslation(0, 0.55, 0),
              ],
              models: [macScreen],
            },
          ],
        },
        {
          mats: [
            new THREE.Matrix4().makeTranslation(0.25, 0.55, 0),
          ],
          models: [keyBoard],
        },
      ],
    },
    {
      mats: [
        new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 1, 0), THREE.Math.degToRad(-15)),
        new THREE.Matrix4().makeTranslation(30, 30, -5),
      ],
      models: [screenContainer],
      children: [{
        mats: [ new THREE.Matrix4().makeTranslation(0.5, 1, 2)],
        models: [screen],
      }],
    },
    {
      mats: [new THREE.Matrix4().makeTranslation(-54, -30, 26)],
      models: [tableLeg],
    },
    {
      mats: [new THREE.Matrix4().makeTranslation(-54, -30, -26)],
      models: [tableLeg],
    },
    {
      mats: [new THREE.Matrix4().makeTranslation(54, -30, -26)],
      models: [tableLeg],
    },
    {
      mats: [new THREE.Matrix4().makeTranslation(54, -30, 26)],
      models: [tableLeg],
    },
  ],
};

export default baseTree;

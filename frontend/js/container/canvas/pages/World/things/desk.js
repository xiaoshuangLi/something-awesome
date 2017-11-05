import 'three';

import Cube from 'js/container/canvas/model/Cube';
import Rect from 'js/container/canvas/model/Rect';

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

const ratio = window.innerHeight / window.innerWidth;
const screenWidth = 32;
const screenHeight = screenWidth * ratio;

const screenContainer = new Cube({
  w: 36,
  h: 66,
  l: 3,
  color: [0.6, 0.6, 0.6, 1.0],
});

const screenBg = new Cube({
  w: screenWidth,
  h: 62,
  l: 0,
  color: [0.2, 0.2, 0.2, 1.0],
});

const screen = new Rect({
  w: screenWidth,
  h: screenHeight,
  color: [1.0, 1.0, 1.0, 0.97],
  useTexture: true,
});

const screenMats = [
  new THREE.Matrix4().makeTranslation(0, 62, -50),
  new THREE.Matrix4().makeTranslation(30, 33, -5).multiply(
    new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 1, 0), THREE.Math.degToRad(-15))
  ),
  new THREE.Matrix4().makeTranslation(0.5, 1, 2),
  new THREE.Matrix4().makeTranslation(screenWidth * -0.5, screenHeight * -0.5, 0.1),
];

const screenViewMat = screenMats.reduce((a, b) => a.clone().multiply(b), new THREE.Matrix4());
screenViewMat.multiply(new THREE.Matrix4().makeTranslation(screenWidth / 2, screenHeight / 2, 0));

const desk = {
  mats: [screenMats[0]],
  models: [table],
  children: [
    {
      mats: [
        new THREE.Matrix4().makeTranslation(-15, 1, 5).multiply(
          new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 1, 0), THREE.Math.degToRad(10))
        ),
      ],
      models: [macPlane],
      children: [
        {
          mats: [
            new THREE.Matrix4().makeTranslation(0, 10, -16.5).multiply(new THREE.Matrix4().makeRotationX(45)),
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
      mats: [screenMats[1]],
      models: [screenContainer],
      children: [{
        mats: [screenMats[2]],
        models: [screenBg],
        children: [
          {
            mats: [screenMats[3]],
            models: [screen],
          },
        ],
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

export { screenViewMat, screenHeight };
export default desk;

import 'three';

import Cube from 'js/container/canvas/model/Cube';
import Rect from 'js/container/canvas/model/Rect';

const birds = {
  children: [],
};

const birdsNum = 5;
const maxAngle = Math.PI / 8;
const bodyLength = 40;
const bodyMore = 8;
const wingWidth = 36;
const headSize = 20;

const head = new Cube({
  w: headSize,
  h: headSize,
  l: headSize,
  color: [0.8, 0.8, 0.8, 1.0],
});

const eyebrow = new Rect({
  w: headSize * 0.4,
  h: headSize * 0.2,
  color: [0.2, 0.2, 0.2, 1.0],
});

const mouse = new Rect({
  w: headSize * 0.5,
  h: headSize * 0.4,
  color: [0.2, 0.2, 0.2, 1.0],
});

const body = new Cube({
  w: 7,
  h: 7,
  l: bodyLength + bodyMore,
  color: [1.0, 1.0, 1.0, 1.0],
});

const wing = new Cube({
  w: wingWidth,
  h: 2,
  l: bodyLength,
});

const getWing = (mult = 1, angle = maxAngle) => {
  const wingTwo = {
    mats: [
      new THREE.Matrix4().makeRotationZ(mult * angle * -1).multiply(
        new THREE.Matrix4().makeTranslation(mult * wingWidth * Math.cos(angle), 0, 0)
      ).multiply(
        new THREE.Matrix4().makeRotationZ(mult * angle * -1)
      ),
    ],
    models: [wing],
  };

  const wingOne = {
    mats: [
      now => new THREE.Matrix4().makeRotationZ(mult * angle * (Math.sin(now * 10) + 0.7)),
      new THREE.Matrix4().makeTranslation(mult * wingWidth / 2, 0, -bodyMore / 2),
    ],
    models: [wing],
    children: [wingTwo],
  };

  return wingOne;
};

const getHead = () => {
  const headEyeLeft = {
    mats: [
      new THREE.Matrix4().makeTranslation(0, 2, 12),
    ],
    models: [eyebrow],
  };

  const headEyeright = {
    mats: [
      new THREE.Matrix4().makeTranslation(-9, 2, 12),
    ],
    models: [eyebrow],
  };

  const headMouse = {
    mats: [
      new THREE.Matrix4().makeTranslation(-5, -8, 12),
    ],
    models: [mouse],
  };

  const birdHead = {
    mats: [
      new THREE.Matrix4().makeTranslation(0, 0, headSize),
    ],
    models: [head],
    children: [headEyeLeft, headEyeright, headMouse],
  };

  return birdHead;
};

const getBird = () => {
  const wingLeft = getWing(-1);
  const wingRight = getWing();
  const birdHead = getHead();

  const bird = {
    mats: [],
    models: [body],
    children: [birdHead, wingLeft, wingRight],
  };

  return bird;
};

const baseMat = new THREE.Matrix4().makeTranslation(0, 300, -600).multiply(
  new THREE.Matrix4().makeRotationY(- Math.PI / 2)
);

const getBirds = () => {
  for (let v = 0; v < birdsNum; v += 1) {
    const bird = getBird();

    bird.mats = [
      now => new THREE.Matrix4().makeRotationY(now),
      new THREE.Matrix4().makeRotationY(Math.random() * 2 * Math.PI)
        .multiply(new THREE.Matrix4().makeTranslation(0, 300 * Math.random(), 0))
        .multiply(baseMat),
    ];

    birds.children.push(bird);
  }
};

getBirds();

export default birds;

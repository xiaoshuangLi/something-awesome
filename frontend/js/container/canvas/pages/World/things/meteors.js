import 'three';

import Cube from 'js/container/canvas/model/Cube';
import Rect from 'js/container/canvas/model/Rect';

const first = 40;
const second = 25;
const minus = 1;
const mult = Math.sin(Math.PI / 4);
const rZMat = new THREE.Matrix4().makeRotationZ(Math.PI / 4);
const rMA = new THREE.Vector3(-1, 1, 0).normalize();
const rA = new THREE.Vector3(1, 0, 0);

const getChip = ({ w = 0, x = 0, angle = 0, y = 0, color = {} } = {}) => {
  const { r = 0.6, g = 0.6, b = 0.6 } = color;

  const model = new Cube({
    w,
    h: w,
    l: 1,
    color: [r, g, b, 0.98],
  });

  const chip = {
    models: [model],
    mats: [
      new THREE.Matrix4().makeTranslation(x, y, 0)
        .multiply(rZMat)
        .multiply(new THREE.Matrix4().makeRotationAxis(rMA, angle)),
    ],
  };

  return chip;
};

const getChips = () => {
  const res = [];

  const random = Math.random() * 100 + 180;
  let x = (first / mult);

  const fistModel = getChip({
    w: first,
    x: (x - first) / 2,
    color: new THREE.Color(`hsl(${random}, 50%, 35%)`),
  });

  const firstTop = getChip({
    w: first / 4,
    x: 4 + x / 2,
    y: 4 + first / 2,
    color: new THREE.Color(`hsl(${random}, 50%, 35%)`),
  });

  const firstBottom = getChip({
    w: first / 4,
    x: 4 + x / 2,
    y: -4 - first / 2,
    color: new THREE.Color(`hsl(${random}, 50%, 35%)`),
  });

  res.push(fistModel);
  res.push(firstTop);
  res.push(firstBottom);

  for (let v = 0; v < second; v += minus) {
    const w = second - v;
    const curr = getChip({
      w,
      x,
      angle: Math.PI * v / 45,
      color: new THREE.Color(`hsl(${random + v * 2}, 50%, ${Math.floor(35 * (1 - v / second))}%)`),
    });

    x += (w / mult);

    res.push(curr);
  }

  return res;
};

const meteorNum = 5;
const meteors = {
  children: [],
};

const baseMats = [
  now => new THREE.Matrix4().makeRotationY(now),
  new THREE.Matrix4().makeTranslation(0, 1200, -3500),
];

const getPathChips = () => {
  for (let v = 0; v < meteorNum; v += 1) {
    const matR = new THREE.Matrix4().makeRotationY(Math.random() * Math.PI * 2);
    const matY = new THREE.Matrix4().makeTranslation(0, Math.random() * 400, 0);

    const curr = {
      mats: [
        now => new THREE.Matrix4().makeRotationAxis(rA, now * 3),
      ],
      children: getChips(),
    }

    const meteor = {
      mats: [ matR, ...baseMats, matY ],
      children: [curr],
    };

    meteors.children.push(meteor);
  }
};

getPathChips();

// const l = 200;
// const bigPoint = 10;
// const space = 4;
// const angleX = Math.PI / 15;
// const angleY = Math.PI / 6;

// const model = new Cube({
//   w: 3,
//   h: 3,
//   l: 3,
//   color: [0.6, 0.6, 0.6, 0.98],
// });

// const getChips = (colorStart = 145) => {
//   for (let v = 0; v < Math.PI / angleX; v += 1) {
//     const chip = {};
//     const currAngle = angleX * v;
//     const x = bigPoint + bigPoint * Math.cos(currAngle);
//     const y = bigPoint * Math.sin(currAngle);
//     const mat = new THREE.Matrix4().makeTranslation(x, y, 0);

//     chip.models = [model];
//     chip.mats = [mat];
//     chip.x = x;
//     chip.y = y;
//     chips.push(chip);    
//   }

//   const left = l - bigPoint;
//   const tan = bigPoint / left;
//   const maxD = left / space;

//   for(let v = 0; v < maxD; v += 1) {
//     const chip = {};
//     const currSpace = v * space;

//     const x = bigPoint * 3 + currSpace;
//     const y = tan * (left - currSpace) * (1 + Math.pow(v, 0.5) / maxD);
//     const mat = new THREE.Matrix4().makeTranslation(x, y, 0);

//     chip.models = [model];
//     chip.mats = [mat];
//     chip.x = x;
//     chip.y = y;
//     chips.push(chip);
//   }

//   const max = chips.length;
//   const rXA = new THREE.Vector3(1, 0, 0);

//   for (let v = 0; v < Math.PI * 2 / angleY; v += 1 ) {
//     const currAngle = angleY * v;
//     const rAngle = currAngle - Math.PI * 0.5;

//     const sin = Math.sin(currAngle);
//     const cos = Math.cos(currAngle);

//     for (let a = 0; a < max; a += 1) {
//       const chip = {};

//       const curr = chips[a];
//       const x = curr.x;
//       const y = curr.y * sin;
//       const z = curr.y * cos;
//       const mat = new THREE.Matrix4().makeTranslation(x, y, z).multiply(
//         new THREE.Matrix4().makeRotationAxis(rXA, rAngle)
//       ).multiply(
//         new THREE.Matrix4().makeScale(Math.random() * 2, Math.random() * 2, Math.random() * 2)
//       );

//       chip.mats = [mat];
//       chip.models = [model];
//       chips.push(chip);
//     }
//   }

//   // chips.forEach((chip, i) => {
//   //   const ratio = (i % max) / max;
//   //   const h = ratio * colorStart + 360 - colorStart ;
//   //   const l = Math.floor((1 - Math.pow(ratio, 0.8)) * 50);
//   //   const color = new THREE.Color(`hsl(${h}, 100%, ${l}%)`);


//   //   chip.models = [model];
//   // });
// }

// getChips();

export default meteors;

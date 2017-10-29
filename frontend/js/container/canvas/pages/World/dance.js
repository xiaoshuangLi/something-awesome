import 'three';

import { createProgramFromSources } from '../../common/func';
import { resize, launch, patchUniforms, animate, worldBuild, modelRender } from '../../common/base';

import beauties from './beauties';

const vShader = `
  attribute vec4 a_position;
  attribute vec4 a_color;
  attribute vec3 a_normal;

  uniform mat4 u_world;
  uniform mat4 u_worldInverse;

  varying vec3 v_normal;
  varying vec4 v_color;

  void main() {
    gl_Position = u_world * a_position;

    v_normal = mat3(u_worldInverse) * a_normal;
    v_color = a_color;
  }
`;

const fShader = `
  precision mediump float;

  varying vec3 v_normal;
  varying vec4 v_color;

  uniform vec3 u_light;
  uniform vec3 u_eye;

  void main() {
    vec3 normal = normalize(v_normal);

    vec3 halfE = normalize(u_eye + u_light);
    float diffuse = clamp(dot(normal, u_light), 0.0, 1.0);
    float specular = pow(clamp(dot(normal, halfE), 0.0, 1.0), 50.0);
    vec4 light = v_color * vec4(vec3(diffuse), 1.0) + v_color * vec4(vec3(specular), 1.0);

    gl_FragColor = light;
    gl_FragColor.rgb += vec3(0.1, 0.1, 0.1);
  }
`;

// const rotationSave = {
//   alpha: 0,
//   beta: 0,
//   gamma: 0,
// };

// const motionSave = {
//   xSave: {
//     spped: 0,
//     distance: 0,
//     all: 0,
//   },
//   ySave: {
//     spped: 0,
//     distance: 0,
//     all: 0,
//   },
//   zSave: {
//     spped: 0,
//     distance: 0,
//     all: 0,
//   },
//   rotation: {
//     alpha: 0,
//     beta: 0,
//     gamma: 0,
//   },
// };

// const time = 0.5;

// const calcMotion = (save = {}, a = 0, rotationRate = {}) => {
//   const { alpha = 0, beta = 0, gamma = 0 } = rotationRate;
//   let { speed = 0 } = save;

//   // a -= 0.02;

//   // if (Math.abs(speedNow) > 20 || Math.abs(a) < 0.5) {
//   //   a =  speed * -0.5;
//   // }

//   // a *= Math.cos(rotationSave.alpha);

//   // if (Math.abs(a) < 1) {
//   //   a = -speed;
//   // }

//   let speedNow = speed + a * time;
//   const distanceMore = speed * time + a * time * time * 0.5;

//   // speedNow = speedNow === speed  ? -0.5 * speedNow : speedNow;

//   // const speedNow = -1 * a * Math.PI / (alpha * 180);
//   // const distanceMore = (speed + speedNow) * time * 0.5;

//   save.speed = speedNow;
//   save.distance = distanceMore;
//   save.all += distanceMore;
// };

// const motionListener = (cb) => {
//   window.addEventListener('devicemotion', (e) => {
//     const { acceleration = {}, rotationRate = {}, accelerationIncludingGravity = {} } = e;
//     const { x, y, z } = acceleration;
//     const { alpha, beta, gamma } = rotationRate;
//     cb && cb(acceleration);

//     calcMotion(motionSave.xSave, x, rotationRate);
//     calcMotion(motionSave.ySave, y, rotationRate);
//     calcMotion(motionSave.zSave, z, rotationRate);

//     motionSave.rotation = {
//       alpha,
//       beta,
//       gamma,
//     };

//     document.querySelector('.coord').innerHTML = `
//       <div>zSpeed: ${motionSave.zSave.speed.toFixed(2)};</div> 
//       <div>zAll: ${motionSave.zSave.all.toFixed(2)};</div> 
//       <div>x: ${x.toFixed(2)};</div> 
//       <div>y: ${y.toFixed(2)};</div> 
//       <div>z: ${z.toFixed(2)};</div>
//       <div>G.x: ${accelerationIncludingGravity.x.toFixed(2)};</div> 
//       <div>G.y: ${accelerationIncludingGravity.y.toFixed(2)};</div> 
//       <div>G.z: ${accelerationIncludingGravity.z.toFixed(2)};</div>
//       <div>alpha: ${Math.floor(alpha)};</div>
//       <div>beta: ${Math.floor(beta)};</div>
//       <div>gamma: ${Math.floor(gamma)};</div>
//     `;
//   }, false);
// };

const orientationListener = (cb) => {
  window.addEventListener('deviceorientation', (e) => {
    const { alpha = 0, beta = 0, gamma = 0 } = e;

    cb && cb({
      alpha,
      beta,
      gamma,
    });
  }, false);
};

const getViewMat = (camera, target, up, projectionMatrix) => {
  const viewMatrix = new THREE.Matrix4().watchAt(camera, target, up);

  const viewProjectionMatrix = new THREE.Matrix4();
  viewProjectionMatrix.multiplyMatrices(projectionMatrix.projectionMatrix, viewMatrix);

  return viewProjectionMatrix;
};

const dance = (selector) => {
  if (!selector) {
    return null;
  }

  const canvas = document.querySelector(selector);
  const gl = canvas.getContext('webgl', {
    antialias: true,
  });

  if (!gl) {
    return null;
  }

  launch(gl);
  const program = createProgramFromSources(gl, [vShader, fShader]);

  const light = new THREE.Vector3(0, 1, 1).normalize();
  const eye = new THREE.Vector3(0, 1, 1);

  patchUniforms(gl, program, {
    u_light: {
      func: gl.uniform3fv,
      args: [[light.x, light.y, light.z]],
    },
    u_eye: {
      func: gl.uniform3fv,
      args: [[eye.x, eye.y, eye.z]],
    },
  });

  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 1;
  const zFar = 2000;
  const projectionMatrix = new THREE.PerspectiveCamera(60, aspect, zNear, zFar);

  const camera = new THREE.Vector3(0, 35, 200);
  const target = new THREE.Vector3(0, 35, 0);
  const up = new THREE.Vector3(0, 1, 0);

  const worldBaseCb = (worldView, worldInverseTranspose) => {
    patchUniforms(gl, program, {
      u_world: {
        func: gl.uniformMatrix4fv,
        args: [false, worldView.elements],
      },
      u_worldInverse: {
        func: gl.uniformMatrix4fv,
        args: [false, worldInverseTranspose.elements],
      },
    });
  };

  let setWorldBase = worldBuild(getViewMat(camera, target, up, projectionMatrix), worldBaseCb);

  let modelRenderBase = modelRender({
    setMat: setWorldBase,
    gl,
    program,
  });

  orientationListener(({ alpha = 0, beta = 0, gamma = 0 } = {}) => {
    beta -= 90;

    const matAlpha = new THREE.Matrix4().makeRotationY(THREE.Math.degToRad(alpha));
    const matGamma = new THREE.Matrix4().makeRotationY(THREE.Math.degToRad(gamma));
    const matBeta = new THREE.Matrix4().makeRotationX(THREE.Math.degToRad(beta));

    const direction = camera.clone().negate().add(target);
    direction.applyMatrix4(matAlpha);
    direction.applyMatrix4(matBeta);
    direction.applyMatrix4(matGamma);

    const newTarget = camera.clone().add(direction);

    const viewMat = getViewMat(camera, newTarget, up, projectionMatrix);

    setWorldBase = worldBuild(viewMat, worldBaseCb);

    modelRenderBase = modelRender({
      setMat: setWorldBase,
      gl,
      program,
    });
  });


  // motionListener(() => {
  //   const { xSave, ySave, zSave, rotation = {} } = motionSave;
  //   const { alpha, beta, gamma } = rotation;

  //   const motionVec = new THREE.Vector3(xSave.distance, ySave.distance, zSave.distance);

  //   const matAlpha = new THREE.Matrix4().makeRotationY(THREE.Math.degToRad(alpha));
  //   const matGamma = new THREE.Matrix4().makeRotationY(THREE.Math.degToRad(gamma - 90));
  //   const matBeta = new THREE.Matrix4().makeRotationX(THREE.Math.degToRad(beta));

  //   const direction = new THREE.Matrix4();
  //   direction.multiply(matAlpha);
  //   direction.multiply(matBeta);
  //   direction.multiply(matGamma);

  //   // motionVec.applyMatrix4(direction);

  //   const motionMat = new THREE.Matrix4().makeTranslation(0, 0, -zSave.distance);

  //   // const motionMat = new THREE.Matrix4().setPosition(motionVec);
  //   beauties.baseMat.multiply(motionMat);
  // });

  let count = 0;

  animate(() => {
    count += 0.01;
    const now = count % 360;

    launch(gl);

    modelRenderBase({
      tree: beauties,
      now,
    });

    gl.flush();
  })();
};

export default dance;


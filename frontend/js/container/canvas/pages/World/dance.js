import 'three';

import { createProgramFromSources } from '../../common/func';
import { resize, launch, patchUniforms, animate } from '../../common/base';

import Cube from '../../model/Cube';

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
    now => new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 1, 0).normalize(), now),
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

const getIfFunc = (res, ...args) => {
  return typeof res === 'function' ? res(...args) : res;
};

const mapTree = ({ gl, program, setMat } = {}) => ({ tree = {}, parent = {}, now = 0 } = {}) => {
  function startMap() {
    const { children = [], mats = [], models = [], baseMat } = tree;
    const worldMat = (baseMat || parent.baseMat).clone();

    mats.fakeForEach((mat) => {
      worldMat.multiply(getIfFunc(mat, now));
    });

    setMat && setMat(worldMat);
    models.fakeForEach(model => model && model.render(gl, program));

    children.fakeForEach((child) => {
      child.baseMat = worldMat;
      tree = child;
      parent = tree;

      startMap();
    });
  }

  startMap();
};

const setWorld = (gl, program, viewProjectionMatrix = new THREE.Matrix4()) => (worldMatrix = new THREE.Matrix4()) => {
  if (!gl || !program) {
    return null;
  }

  const worldView = new THREE.Matrix4();
  worldView.multiplyMatrices(viewProjectionMatrix, worldMatrix);

  const worldInverse = new THREE.Matrix4();
  worldInverse.getInverse(worldMatrix);

  const worldInverseTranspose = worldInverse.transpose();

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

  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 1;
  const zFar = 2000;

  const light = new THREE.Vector3(0, 1, 1);
  light.normalize();

  const eye = new THREE.Vector3(0, 1, 1);

  const projectionMatrix = new THREE.PerspectiveCamera(60, aspect, zNear, zFar);

  const camera = new THREE.Vector3(60, 105, 200);
  const target = new THREE.Vector3(0, 35, 0);
  const up = new THREE.Vector3(0, 1, 0);

  const cameraMatrix = new THREE.Matrix4();
  cameraMatrix.makeTranslation(camera.x, camera.y, camera.z);
  cameraMatrix.lookAt(camera, target, up);

  const viewMatrix = new THREE.Matrix4();
  viewMatrix.getInverse(cameraMatrix);

  const viewProjectionMatrix = new THREE.Matrix4();
  viewProjectionMatrix.multiplyMatrices(projectionMatrix.projectionMatrix, viewMatrix);

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

  const setWorldBase = setWorld(gl, program, viewProjectionMatrix);
  const mapTreeBase = mapTree({
    setMat: setWorldBase,
    gl,
    program,
  });

  let count = 0;

  animate(() => {
    count += 0.01;
    const now = count % 360;

    // const worldMatrix = new THREE.Matrix4();

    // worldMatrix.makeTranslation(0, 0, 0);
    // worldMatrix.makeRotationAxis((new THREE.Vector3(1, 0, 0)).normalize(), now);

    // setWorldBase(worldMatrix);
    // table.render(gl, program);

    mapTreeBase({
      tree: baseTree,
      now,
    });

    resize(gl);

    gl.flush();
  })();
};

export default dance;


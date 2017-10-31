import 'three';

import { createProgramFromSources } from '../../common/func';
import { launch, patchUniforms, animate, worldBuild, modelRender, getViewMat, addMobileControl, addPCControl } from '../../common/base';

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

  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 1;
  const zFar = 2000;
  const camera = new THREE.PerspectiveCamera(60, aspect, zNear, zFar);
  const cameraMat = camera.projectionMatrix;

  const eye = new THREE.Vector3(0, 35, 200);
  const target = new THREE.Vector3(0, 35, 0);
  const up = new THREE.Vector3(0, 1, 0);

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

  const setting = {
    view: {
      eye,
      target,
      up,
    },
    cameraMat,
  };

  let setWorldBase = worldBuild(getViewMat(setting), worldBaseCb);

  let modelRenderBase = modelRender({
    setMat: setWorldBase,
    gl,
    program,
  });

  addMobileControl(setting, beauties, (newViewMat) => {
    setWorldBase = worldBuild(newViewMat, worldBaseCb);
    modelRenderBase = modelRender({
      setMat: setWorldBase,
      gl,
      program,
    });
  })();

  addPCControl(setting, beauties, (newViewMat) => {
    setWorldBase = worldBuild(newViewMat, worldBaseCb);
    modelRenderBase = modelRender({
      setMat: setWorldBase,
      gl,
      program,
    });
  })('#world');

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

    return true;
  })();
};

export default dance;


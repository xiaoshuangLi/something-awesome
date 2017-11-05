import 'three';

import Animate from 'js/components/Animate';
import Raven from 'js/components/Raven';

import { createProgramInfo, setUniforms } from '../../common/webgl';
import { launch, worldBuild, modelRender, getViewMat, addMobileControl, addPCControl, createTexrue } from '../../common/base';

import things, { screenMat, screenHeight } from './things';

const vShader = `
  attribute vec4 a_position;
  attribute vec4 a_color;
  attribute vec3 a_normal;

  uniform mat4 u_world;
  uniform mat4 u_worldInverse;

  varying vec3 v_normal;
  varying vec4 v_color;
  varying vec4 v_position;

  void main() {
    gl_Position = u_world * a_position;

    v_normal = mat3(u_worldInverse) * a_normal;
    v_color = a_color;
    v_position = a_position;
  }
`;

const width = parseFloat(Math.min(window.innerWidth - 100, 1500)).toFixed(1);

const fShader = `
  precision mediump float;

  uniform vec3 u_light;
  uniform vec3 u_eye;
  uniform sampler2D u_texture;

  varying vec3 v_normal;
  varying vec4 v_color;
  varying vec4 v_position;

  void main() {
    float d = distance(v_position.xyz, vec3(0,0,0));
    vec3 normal = normalize(v_normal);

    vec3 halfE = normalize(u_eye + u_light);
    float diffuse = clamp(dot(normal, u_light), 0.0, 1.0);
    float specular = pow(clamp(dot(normal, halfE), 0.0, 1.0), 50.0);
    vec4 light = v_color * vec4(vec3(diffuse), 1.0) + v_color * vec4(vec3(specular), 1.0);

    gl_FragColor = light;
    gl_FragColor.rgb += vec3(0.1, 0.1, 0.1) ;

    if(v_color.a > 0.99) {
      gl_FragColor.rgb *= clamp((1.0 - d/${width}), 0.0, 1.0);
    } else {
      gl_FragColor.a = 1.0;

      if (v_color.a > 0.96 && v_color.a < 0.98) {
        vec2 textureCoord = vec2(v_color.r, v_color.g);
        vec4 screenColor = texture2D(u_texture, textureCoord);
        gl_FragColor = screenColor * vec4(vec3(diffuse), 1.0) + screenColor * vec4(vec3(specular), 1.0);
        gl_FragColor.rgb += vec3(0.1, 0.1, 0.1) ;
      }
    }
  }
`;

const getCamera = (angle, near, far) => {
  const aspect = window.innerWidth / window.innerHeight;
  const camera = new THREE.PerspectiveCamera(angle, aspect, near, far);

  return camera.projectionMatrix;
};

const dance = (selector, status) => {
  if (!selector.world) {
    return null;
  }

  const canvas = document.querySelector(selector.world);
  const screen = document.querySelector(selector.screen);

  const gl = canvas.getContext('webgl', {
    antialias: true,
  });

  if (!gl) {
    return null;
  }

  launch(gl);
  const programInfo = createProgramInfo(gl, [vShader, fShader]);
  const { program } = programInfo;

  const light = new THREE.Vector3(0, 1, 1).normalize();

  const zNear = 1;
  const zFar = 20000;
  const cameraMat = getCamera(60, zNear, zFar);

  const eye = new THREE.Vector3(0, 35, 200);
  const target = new THREE.Vector3(0, 35, 0);
  const up = new THREE.Vector3(0, 1, 0);

  const screenAdjustMat = new THREE.Matrix4().makeTranslation(0, -35, 0).multiply(screenMat);
  eye.applyMatrix4(screenAdjustMat);
  target.applyMatrix4(screenAdjustMat);

  const direction = new THREE.Vector3().subVectors(target, eye);
  const ratio = 1 - (screenHeight * Math.pow(3, 0.5) / 2) / 200;
  const tranMat = new THREE.Matrix4().makeTranslation(direction.x * ratio, 0, direction.z * ratio);

  eye.applyMatrix4(tranMat);
  target.applyMatrix4(tranMat);

  // const tranInverseMat = new THREE.Matrix4().getInverse(tranMat.clone().multiply(screenAdjustMat));
  // eye.applyMatrix4(tranInverseMat);
  // target.applyMatrix4(tranInverseMat);

  gl.useProgram(program);

  setUniforms(programInfo, {
    u_light: [light.x, light.y, light.z],
    u_eye: [eye.x, eye.y, eye.z],
  });

  const worldBaseCb = (worldView, worldInverseTranspose) => {
    setUniforms(programInfo, {
      u_world: worldView.elements,
      u_worldInverse: worldInverseTranspose.elements,
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
  let viewMat = getViewMat(setting);
  let setWorldBase = worldBuild(viewMat, worldBaseCb);
  let modelRenderBase = modelRender({
    setMat: setWorldBase,
    gl,
    programInfo,
  });

  const resetRenderBase = (newViewMat = viewMat) => {
    setWorldBase = worldBuild(newViewMat, worldBaseCb);
    modelRenderBase = modelRender({
      setMat: setWorldBase,
      gl,
      programInfo,
    });
  };

  addMobileControl(setting, things, resetRenderBase)();
  addPCControl(setting, things, resetRenderBase, status.getScreen)('#world');

  let count = 0;

  const ani = new Animate(() => {
    count += 0.01;
    const now = count % 360;

    launch(gl);

    const texture = createTexrue(gl, screen);

    setUniforms(programInfo, {
      u_texture: texture,
    });

    modelRenderBase({
      tree: things,
      now,
    });

    gl.flush();
  });

  ani.start();
};

export default dance;


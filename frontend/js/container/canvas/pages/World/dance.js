import 'three';

import Animate from 'js/components/Animate';
import Raven from 'js/components/Raven';

import { createProgramInfo, setUniforms } from '../../common/webgl';
import { launch, worldBuild, modelRender, getViewMat, addMobileControl, addPCControl } from '../../common/base';

import things from './things';


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

  varying vec3 v_normal;
  varying vec4 v_color;
  varying vec4 v_position;

  uniform vec3 u_light;
  uniform vec3 u_eye;

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
    }
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
  const programInfo = createProgramInfo(gl, [vShader, fShader]);
  const { program } = programInfo;

  const light = new THREE.Vector3(0, 1, 1).normalize();

  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 1;
  const zFar = 20000;
  const camera = new THREE.PerspectiveCamera(60, aspect, zNear, zFar);
  const cameraMat = camera.projectionMatrix;

  const eye = new THREE.Vector3(0, 35, 200);
  const target = new THREE.Vector3(0, 35, 0);
  const up = new THREE.Vector3(0, 1, 0);

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

  let setWorldBase = worldBuild(getViewMat(setting), worldBaseCb);

  let modelRenderBase = modelRender({
    setMat: setWorldBase,
    gl,
    programInfo,
  });

  addMobileControl(setting, things, (newViewMat) => {
    setWorldBase = worldBuild(newViewMat, worldBaseCb);
    modelRenderBase = modelRender({
      setMat: setWorldBase,
      gl,
      programInfo,
    });
  })();

  addPCControl(setting, things, (newViewMat) => {
    setWorldBase = worldBuild(newViewMat, worldBaseCb);
    modelRenderBase = modelRender({
      setMat: setWorldBase,
      gl,
      programInfo,
    });
  })('#world');

  let count = 0;

  const ani = new Animate(() => {
    count += 0.01;
    const now = count % 360;

    launch(gl);

    modelRenderBase({
      tree: things,
      now,
    });

    gl.flush();
  });

  ani.start();
};

export default dance;


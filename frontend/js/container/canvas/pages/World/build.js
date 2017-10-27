import 'three';

import { createProgramFromSources } from '../../common/func';

import Cube from '../../model/Cube';

const vertextShaderSource = `
  attribute vec4 a_position;
  attribute vec4 a_color;
  attribute vec3 a_normal;

  uniform mat4 u_worldViewProjection;
  uniform mat4 u_worldInverseProjection;

  varying vec3 v_normal;
  varying vec4 v_color;

  void main() {
    gl_Position = u_worldViewProjection * a_position;

    v_normal = mat3(u_worldInverseProjection) * a_normal;
    v_color = a_color;
  }
`;

const fragmentShaderSource = `
  precision mediump float;

  varying vec3 v_normal;
  varying vec4 v_color;

  uniform vec3 u_reverseLightDirection;
  uniform vec3 u_eyeDirection;
  uniform vec4 u_color;

  void main() {
    vec3 normal = normalize(v_normal);

    vec3 halfE = normalize(u_eyeDirection + u_reverseLightDirection);
    float diffuse = clamp(dot(normal, u_reverseLightDirection), 0.0, 1.0);
    float specular = pow(clamp(dot(normal, halfE), 0.0, 1.0), 50.0);
    vec4 light = v_color * vec4(vec3(diffuse), 1.0) + v_color * vec4(vec3(specular), 1.0);

    gl_FragColor = light;
    gl_FragColor.rgb += vec3(0.1, 0.1, 0.1);
  }
`;

const runWin = (func) => {
  if (typeof window === 'undefined') {
    return () => {};
  }

  return func;
};

const resize = runWin((canvas) => {
  if (!canvas) {
    return null;
  }

  const { devicePixelRatio = 1 } = window;
  const { clientWidth = 0, clientHeight = 0 } = canvas;

  const dW = clientWidth * devicePixelRatio;
  const dH = clientHeight * devicePixelRatio;

  if (canvas.width !== dW || canvas.height !== dH) {
    canvas.width = dW;
    canvas.height = dH;
  }
});

const base = (gl) => {
  if (!gl) {
    return null;
  }

  resize(gl.canvas);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);

  gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT);

  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);
};

const setData = (gl, dataObj, { pL, nL, cL }) => {
  const { positions, normals, indexs, colors } = dataObj;

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
  // gl.bindBuffer(gl.ARRAY_BUFFER, null);

  gl.enableVertexAttribArray(pL);
  gl.vertexAttribPointer(pL, 3, gl.FLOAT, false, 0, 0);

  const normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
  // gl.bindBuffer(gl.ARRAY_BUFFER, null);

  gl.enableVertexAttribArray(nL);
  gl.vertexAttribPointer(nL, 3, gl.FLOAT, false, 0, 0);

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

  gl.enableVertexAttribArray(cL);
  gl.vertexAttribPointer(cL, 4, gl.FLOAT, false, 0, 0);

  const indexBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(indexs), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
}

const build = runWin((selector = '') => {
  if (!selector) {
    return null;
  }

  const canvas = document.querySelector(selector);
  const gl = canvas.getContext('webgl');

  if (!gl) {
    return null;
  }

  base(gl);

  const program = createProgramFromSources(gl, [vertextShaderSource, fragmentShaderSource]);

  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
  const normalAttributeLocation = gl.getAttribLocation(program, 'a_normal');
  const colorAttributeLocation = gl.getAttribLocation(program, 'a_color');

  const worldViewProjectionLocation = gl.getUniformLocation(program, 'u_worldViewProjection');
  const worldInverseTransposeLocation = gl.getUniformLocation(program, 'u_worldInverseProjection');
  const colorLocation = gl.getUniformLocation(program, 'u_color');
  const reverseLightDirectionLocation = gl.getUniformLocation(program, 'u_reverseLightDirection');
  const eyeDirectionLocation = gl.getUniformLocation(program, 'u_eyeDirection');

  const bigCube = new Cube({
    w: 80,
    h: 4,
    l: 48,
    color: [0.19, 0.52, 0.87, 1.0],
  });

  const smCube = new Cube({
    w: 20,
    h: 20,
    l: 20,
    color: [1.0, 0.0, 0.0, 1.0],
  });

  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 1;
  const zFar = 2000;

  const projectionMatrix = new THREE.PerspectiveCamera(60, aspect, zNear, zFar);

  const camera = new THREE.Vector3(100, 150, 200);
  const target = new THREE.Vector3(0, 35, 0);
  const up = new THREE.Vector3(0, 1, 0);

  const cameraMatrix = new THREE.Matrix4();
  cameraMatrix.makeTranslation(camera.x, camera.y, camera.z);
  cameraMatrix.lookAt(camera, target, up);

  const viewMatrix = new THREE.Matrix4();
  viewMatrix.getInverse(cameraMatrix);

  const viewProjectionMatrix = new THREE.Matrix4();
  viewProjectionMatrix.multiplyMatrices(projectionMatrix.projectionMatrix, viewMatrix);

  let count = 0;

  test();

  function test() {
    count += 0.01;
    const res = count % 360;

    const worldMatrix = new THREE.Matrix4();
    worldMatrix.makeTranslation(0, -30, -100);
    worldMatrix.makeRotationAxis((new THREE.Vector3(1, 0, 0)).normalize(), res);

    const worldViewProjectionMatrix = new THREE.Matrix4();
    worldViewProjectionMatrix.multiplyMatrices(viewProjectionMatrix, worldMatrix);

    const worldInverseMatrix = new THREE.Matrix4();
    worldInverseMatrix.getInverse(worldMatrix);

    const light = new THREE.Vector3(0, 0, 1);
    light.normalize();

    const eye = new THREE.Vector3(0, 1, 1);

    const worldInverseTransposeMatrix = worldInverseMatrix.transpose();

    gl.useProgram(program);

    gl.uniformMatrix4fv(worldViewProjectionLocation, false, worldViewProjectionMatrix.elements);
    gl.uniformMatrix4fv(worldInverseTransposeLocation, false, worldInverseTransposeMatrix.elements);

    gl.uniform4fv(colorLocation, [0.95, 0.3, 0.9, 1]);
    gl.uniform3fv(reverseLightDirectionLocation, [light.x, light.y, light.z]);
    gl.uniform3fv(eyeDirectionLocation, [eye.x, eye.y, eye.z]);

    setData(gl, bigCube, {
      pL: positionAttributeLocation,
      nL: normalAttributeLocation,
      cL: colorAttributeLocation,
    });

    gl.drawElements(gl.TRIANGLES, bigCube.indexs.length, gl.UNSIGNED_SHORT, 0);

    const tW = new THREE.Matrix4();
    tW.makeTranslation(0, 50, 0);

    const rW = new THREE.Matrix4();
    rW.makeRotationAxis((new THREE.Vector3(0, 1, 0)).normalize(), res);

    const nW = worldMatrix;
    nW.multiply(rW);
    nW.multiply(tW);
    // nW.setPosition(0, 0, 0);

    const wVP = new THREE.Matrix4();
    wVP.multiplyMatrices(viewProjectionMatrix, nW);

    const nWInverse = new THREE.Matrix4();
    nWInverse.getInverse(nW);

    const nWIT = nWInverse.transpose();

    gl.uniformMatrix4fv(worldViewProjectionLocation, false, wVP.elements);
    gl.uniformMatrix4fv(worldInverseTransposeLocation, false, nWIT.elements);

    setData(gl, smCube, {
      pL: positionAttributeLocation,
      nL: normalAttributeLocation,
      cL: colorAttributeLocation,
    });

    gl.drawElements(gl.TRIANGLES, smCube.indexs.length, gl.UNSIGNED_SHORT, 0);

    gl.flush();

    requestAnimationFrame(test);
  }
});

export default build;

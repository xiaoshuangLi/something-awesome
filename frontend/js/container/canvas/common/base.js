import 'three';

THREE.Matrix4.prototype.watchAt = function(eye, center, up) {
  this.makeTranslation(eye.x, eye.y, eye.z);
  this.lookAt(eye, center, up);

  return this.getInverse(this);
};

Object.defineProperties(Array.prototype, {
  fakeForEach: {
    value(cb) {
      const list = this;
      const { length = 0 } = list;

      if (!length) {
        return list;
      }

      for (let v = 0; v < length; v += 1) {
        cb(list[v], v);
      }
    },
  },

  fakeMap: {
    value(cb) {
      const list = this;
      const res = [];

      list.fakeForEach((item) => {
        res.push(cb(item));
      });

      return res;
    },
  },
});

const runWin = (func) => {
  if (typeof window === 'undefined') {
    return () => {};
  }

  return func;
};

const resize = runWin((gl) => {
  if (!gl) {
    return null;
  }

  const { canvas } = gl;

  const { devicePixelRatio = 1 } = window;
  const { clientWidth = 0, clientHeight = 0 } = canvas;

  const dW = clientWidth * devicePixelRatio;
  const dH = clientHeight * devicePixelRatio;

  if (canvas.width !== dW || canvas.height !== dH) {
    canvas.width = dW;
    canvas.height = dH;
  }
});

const launch = (gl) => {
  if (!gl) {
    return null;
  }

  resize(gl);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);

  gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT);

  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);
};

const patchUniforms = (gl, program, obj = {}) => {
  if (!gl || !program) {
    return null;
  }

  const keys = Object.keys(obj);

  gl.useProgram(program);

  keys.fakeForEach((key) => {
    const uniform = gl.getUniformLocation(program, key);

    const value = obj[key] || {};
    const { func, args = [] } = value;

    func.call(gl, uniform, ...args);
  });
};

const setIndexBuffer = (gl, obj = {}) => {
  if (!gl) {
    return null;
  }

  const { target = gl.ELEMENT_ARRAY_BUFFER, usage = gl.STATIC_DRAW, data = [], clear = false } = obj;

  const buffer = gl.createBuffer();

  gl.bindBuffer(target, buffer);
  gl.bufferData(target, data, usage);

  clear && gl.bindBuffer(target, null);

  return buffer;
};

const patchAttributes = (gl, program, obj = {}) => {
  if (!gl || !program) {
    return null;
  }

  const keys = Object.keys(obj);

  keys.fakeForEach((key) => {
    const attribute = gl.getAttribLocation(program, key);

    const value = obj[key] || {};
    const { data = [], target = gl.ARRAY_BUFFER, usage = gl.STATIC_DRAW, clear = true, args = [] } = value;

    const buffer = gl.createBuffer();

    gl.bindBuffer(target, buffer);
    gl.bufferData(target, data, usage);

    gl.enableVertexAttribArray(attribute);
    gl.vertexAttribPointer(attribute, ...args);

    clear && gl.bindBuffer(target, null);
  });
};

const animate = func => (...list) => {
  let id;

  function run() {
    id && window.cancelAnimationFrame(id);
    id = window.requestAnimationFrame(run);

    func(...list);
  }

  run();
};


const getIfFunc = (res, ...args) => {
  return typeof res === 'function' ? res(...args) : res;
};

const worldBuild = (viewMat = new THREE.Matrix4(), cb) => (worldMat = new THREE.Matrix4()) => {
  const worldView = new THREE.Matrix4();
  worldView.multiplyMatrices(viewMat, worldMat);

  const worldInverse = new THREE.Matrix4();
  worldInverse.getInverse(worldMat);

  const worldInverseTranspose = worldInverse.transpose();

  cb && cb(worldView, worldInverseTranspose);
};

const modelRender = ({ gl, program, setMat } = {}) => ({ tree = {}, now = 0 } = {}) => {
  function startMap() {
    const { children = [], mats = [], models = [], baseMat, parentMat } = tree;

    const worldMat = new THREE.Matrix4().multiply(baseMat || parentMat);

    mats.fakeForEach(mat => worldMat.multiply(getIfFunc(mat, now)));
    setMat && setMat(worldMat);

    models.fakeForEach(model => model && model.render(gl, program));

    children.fakeForEach((child) => {
      child.parentMat = worldMat;
      tree = child;

      startMap();
    });
  }

  startMap();
};

export default {
  resize,
  launch,
  patchUniforms,
  patchAttributes,
  setIndexBuffer,
  animate,
  getIfFunc,
  worldBuild,
  modelRender,
};

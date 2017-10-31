import 'three';

import { getEle } from 'js/common';

import Raven from 'js/components/Raven';

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

const getArray = (res) => {
  res = Array.isArray(res) ? res : [res];

  return res;
};

const addListeners = (listeners, cb) => (ele) => {
  ele = getEle(ele);
  listeners = getArray(listeners);

  listeners.fakeForEach(
    listener => ele.addEventListener(listener, e => cb(e, listener), false)
  );
};

const batchAddListeners = obj => (ele) => {
  obj = getArray(obj);

  obj.fakeForEach((item = {}) => {
    const { listeners, cb } = item;

    addListeners(listeners, cb)(ele);
  });
};

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

    if (!func(...list)) {
      return null;
    }

    id = window.requestAnimationFrame(run);
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

const getViewMat = (setting = {}) => {
  const { view: { eye, target, up } = {}, cameraMat } = setting;
  const viewMat = new THREE.Matrix4().watchAt(eye, target, up);

  return cameraMat.clone().multiply(viewMat);
};

const getFirstTouch = (e) => {
  const touches = e.touches || e.targetTouches || [];
  const oneTouch = touches[0] || {};

  return oneTouch;
};

const translateModels = (models) => {
  const { baseMat } = models;

  return (cX = 0, cZ = 0) => {
    const mat = new THREE.Matrix4().makeTranslation(cX, 0, cZ);
    baseMat.multiply(mat);
  }
};

const getRotateViewMat = (setting = {}) => {
  const { view: { eye, target, up } = {}, cameraMat } = setting;

  return (angleX = 0, angleY = 0) => {
    const matX = new THREE.Matrix4().makeRotationX(angleX);
    const matY = new THREE.Matrix4().makeRotationY(angleY);

    const direction = new THREE.Vector3().subVectors(target, eye);
    direction.applyMatrix4(matX);
    direction.applyMatrix4(matY);

    const newTarget = eye.clone().add(direction);
    const newViewMat = getViewMat({
      cameraMat,
      view: {
        eye,
        target: newTarget,
        up,
      },
    });

    return newViewMat;
  };
};

const addPCControl = (setting = {}, models, cb) => {
  const { innerWidth = 0, innerHeight = 0 } = window;

  let baseX = 0;
  let baseY = 0;

  const mX = Math.PI * 2 / innerWidth;
  const mY = Math.PI * 2 / innerHeight;

  let cX = 0;
  let cY = 0;
  let pressing = true;
  const distance = 2;

  const getRotateView = getRotateViewMat(setting);
  const transModels = translateModels(models);

  const keyboards = [
    {
      keys: [38, 87, 119], // ⬆, w, W
      cb(sinD, cosD) {
        cX = sinD;
        cY = cosD;
      },
    },
    {
      keys: [37, 65, 97], // ⬅, a, A
      cb(sinD, cosD) {
        cX = -cosD;
        cY = sinD;
      },
    },
    {
      keys: [40, 83, 115], // ⬇, s, S
      cb(sinD, cosD) {
        cX = -sinD;
        cY = -cosD;
      },
    },
    {
      keys: [39, 68, 100], // ➡, d, D
      cb(sinD, cosD) {
        cX = cosD;
        cY = -sinD;
      },
    },
  ];

  return batchAddListeners([
    {
      listeners: 'click',
      cb(e) {
        const ele = e.target;

        if (!ele) {
          return null;
        }

        ele.requestPointerLock =
          ele.requestPointerLock ||
          ele.mozRequestPointerLock;

        document.exitPointerLock =
          document.exitPointerLock ||
          document.mozExitPointerLock;

        document.pointerLockElement ? document.exitPointerLock() : ele.requestPointerLock();
      },
    },
    {
      listeners: 'mousemove',
      cb(e) {
        if (!document.pointerLockElement) {
          return null;
        }

        const { movementX, movementY } = e;

        baseX -= (movementY) * 0.3;
        baseY -= (movementX) * 0.3;

        const angleX = baseX * mX;
        const angleY = baseY * mY;

        const newViewMat = getRotateView(angleX, angleY);

        cb && cb(newViewMat);
      },
    },
    {
      listeners: 'keydown',
      cb(e) {
        const { which } = e;
        const angleY = baseY * mY;

        const sin = Math.sin(angleY);
        const cos = Math.cos(angleY);

        const sinD = distance * sin;
        const cosD = distance * cos;

        keyboards.fakeForEach((item = {}) => {
          const { keys = [], cb } = item;

          if (!~keys.indexOf(which)) {
            return null;
          }

          cb && cb(sinD, cosD);
        });

        if (pressing) {
          return null;
        }

        pressing = true;
        animate(() => {
          pressing && transModels(cX, cY);

          return pressing;
        })();
      },
    },
    {
      listeners: 'keyup',
      cb() {
        pressing = false;
      },
    },
  ]);
};

const addMobileControl = (setting = {}, models, cb) => {
  let lastClientX = 0;
  let lastClientY = 0;

  const roatationSave = {
    beta: 0,
    alpha: 0,
    gamma: 0,
  };

  const getRotateView = getRotateViewMat(setting);
  const transModels = translateModels(models);

  return batchAddListeners([
    {
      listeners: 'touchstart',
      cb(e) {
        const oneTouch = getFirstTouch(e);
        const { clientX = 0, clientY = 0 } = oneTouch;

        lastClientX = clientX;
        lastClientY = clientY;
      },
    },
    // {
    //   listeners: 'devicemotion',
    //   cb(e) {
    //     const { accelerationIncludingGravity = {} } = e;
    //     Raven.watch(Object.assign({a: 1}, accelerationIncludingGravity));
    //   },
    // },
    {
      listeners: 'touchmove',
      cb(e) {
        e.preventDefault();

        const oneTouch = getFirstTouch(e);
        const { clientX = 0, clientY = 0 } = oneTouch;
        const { alpha = 0 } = roatationSave;

        const tX = (clientX - lastClientX) * 0.7;
        const tZ = (clientY - lastClientY) * 0.7;

        const rad = THREE.Math.degToRad(alpha);
        const sin = Math.sin(rad);
        const cos = Math.cos(rad);

        const cX = tZ * sin + tX * cos;
        const cZ = tZ * cos + tX * sin * -1;

        lastClientX = clientX;
        lastClientY = clientY;
        transModels(cX, cZ);
      },
    },
    {
      listeners: 'deviceorientation',
      cb(e) {
        const { alpha = 0, beta = 0, gamma = 0 } = e;

        Object.assign(roatationSave, { alpha, beta, gamma });

        const angleX = beta === null ? 0 : THREE.Math.degToRad(beta - 90);
        const angleY = THREE.Math.degToRad(alpha + gamma);

        const newViewMat = getRotateView(angleX, angleY);

        cb && cb(newViewMat);
      },
    },
  ]);
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
  getViewMat,
  addMobileControl,
  addPCControl,
};

Object.defineProperties(Array.prototype, {
  fakeForEach: {
    value(cb) {
      const list = this;
      const { length = 0 } = list;

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

      return list;
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
    func(...list);

    id && window.cancelAnimationFrame(id);
    id = window.requestAnimationFrame(run);
  }

  run();
};

export default {
  resize,
  launch,
  patchUniforms,
  patchAttributes,
  setIndexBuffer,
  animate,
};

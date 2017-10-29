const funcs = {};
const listeners = ['deviceorientation'];

let baseId = new Date().getTime();

const getUniqueId = () => {
  baseId += 1;

  return baseId;
};

const callback = (listener, e) => {
  const values = Object.values(funcs);

  values.forEach(value => value(listener, e));
};

listeners.forEach(
  listener => window.addEventListener(listener, e => callback(e, listener))
);

const setFunc = (func, id) => {
  id = id || getUniqueId();

  funcs[id] = func;
};

const removeFunc = (id) => {
  if (!id || !funcs[id]) {
    return null;
  }

  delete funcs[id];
};

const startTrigger = (ele = window) => {
  ele = typeof ele === 'string' ? document.querySelector(ele) : ele;

  if (!ele) {
    return null;
  }

  listeners.forEach(
    listener => window.addEventListener(listener, e => callback(e, listener))
  );
}

export default {
  setFunc,
  removeFunc,
};

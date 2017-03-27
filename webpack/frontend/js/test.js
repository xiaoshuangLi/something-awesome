import { compose } from 'redux';

function _composeObjFunc(){
  let list = [].slice.call(arguments);
  let res = Object.assign.apply(null, [{}, ...list]);

  Object.keys(res).forEach(attr => {
    let funcs = []

    for(let v = list.length - 1; v > -1; v --) {
      let item = list[v][attr];
      if(typeof item === 'function')
        funcs.push(item)
    }

    if(funcs.length <= 1) {
      return
    }

    res[attr] = compose.apply(null, funcs)
  })

  return res
}

// function _getComposedOptions(options = {}) {
//   return (opts = {}) => _composeObjFunc(options, opts)
// }

// export { _getComposedOptions as getComposedOptions }

let options, opts;
// let defaultOpts = _getComposedOptions(options || {});
// let apiOpts = defaultOpts(opts || {});

// export const createFetchAPI = ({ options = {}, checkStatus, parseJSON, middlewares } = {}) => (opts) => {
//   if (!(middlewares instanceof Array)) {
//     middlewares = [middlewares];
//   }
//   return fetchAPI(_composeObjFunc(options, opts), { checkStatus, parseJSON, middlewares });
// };

export const createAPI = (obj = {}) => (opts) => {
  return createFetchAPI( 
    Object.assign({}, obj, { options: _composeObjFunc(options, opts) }) 
  )();
};

let api = createAPI({
  options: {},
  middlewares: []
});

api(opts);
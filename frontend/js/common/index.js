export function load(src = '', cb){
  if(!src) {
    return cb && cb()
  }
  let img = new Image()
  img.src = src

  img.onload = () => {
    cb&&cb(img)
  };
  img.onerror = () => {
    cb&&cb(img)
  };
}

export function loadAll(list = [], cb){
  typeof list == 'string' && (list = [list])

  if(!list.length) {
    return cb && cb()
  }

  let num = 0
  let len = list.length
  let imgs = []

  list.map(img => {
    load(img, ele => {
      num++

      for(let v = 0; v < list.length; v ++) {
        const val = list[v];
        const { src } = ele;
        const index = src.indexOf(val);

        if(!!~index) {
          imgs[index] = ele;
          break;
        }
      }

      if(num >= len) {
        return cb && timeout(() => {
          cb(imgs)
        })
      }
    })
  })
}

export function isUndefined(val, dVal = '') {
  return val === undefined ? dVal : val
}

function valid(el){
  if(!el) {
    return true
  }

  if(el.checkValidity) {
    return el.checkValidity()
  }

  return true
}

export function validInput(el){
  if(!el) {
    return true
  }

  if(el.checkValidity) {
    return el.checkValidity()
  }

  let eles = el.querySelectorAll('*')

  for(let v = 0, l = eles.length; v <= l ; v++) {
    if(!valid(eles[v])) {
      return false
    }
  }

  return true
}

export function map(list = [], cb) {
  for(let v = 0, l = list.length; v < l; v++ ) {
    cb&&cb(list[v])
  }
}

export function getChildren(ele, parent) {
  ele = ele.length ? ele : [ele]

  let list = [];
  map(ele, curr => {
    let children = curr.children || []

    map(children, child => {
      list.push(child)
    })

    parent === -1 && list.unshift(curr)
    parent === 1 && list.push(curr)
  })

  return list
}

export function getChildrenByLevel(ele = document, level = 1, parent = 0) {
  let list = ele.length ? ele : [ele]

  for(let v = 0; v <= level; v++) {
    list = getChildren(list, parent)
  }

  return list
}

export function getFromArr(arr = [],attr = 'id', val = '', index = false ) {

  for( let v = 0, l = arr.length; v < l; v++ ) {
    let item = arr[v]

    if(item[attr] === val) {
      return index ? v : item
    }
  }

  return index ? -1 : {}
}

export function timeout(cb, time) {
  if (!cb) {
    return;
  }
  time = time || 0;

  var timeout = setTimeout(function() {
    cb();
    clearTimeout(timeout);
  }, time)
}

export function getStyles(ele = '', attr = '') {
  if(!ele || !attr) {
    return '';
  }
  let view = ele.ownerDocument.defaultView

  if ( !view || !view.opener ) {
    view = window
  }

  let res = view.getComputedStyle(ele)

  return res[attr] || ''
}

const styles = {
  title: 'font-size: 18px; color: #666; font-weight: bold; text-align: center;',
  normal: 'text-indent: 28px; font-size: 12px; color: #666;',
  desc: 'font-size: 12px; color: #bbb;',
}

export function logCus(txt = '', type = 'normal') {
  if(type === 'normal') {
    txt = `  ${txt}`;
  }

  if(type === 'desc') {
    txt = `  (${txt})`;
  }

  console.log(`%c${txt}`, styles[type] || type);
}

const line = [ '', '|', '| -', '| - -', '| - - -', '我', '是', '一', '条', '分', '割', '线', '| - - -', '| - -', '| -', '|', ''];

export function logSpeech(speech = [], notClear = false) {
  !notClear && console.clear();
  const types = Object.keys(styles);

  speech.forEach((item, i) => {
    if(item === 'line') {
      return logSpeech(line, true);
    }

    if(typeof item === 'string') {
      item = {
        txt: item,
        type: i === 0 ? 'title' : 'normal',
      };
    }

    logCus(item.txt, item.type);
  });
}
export function getEles(selector) {
  if (!selector) {
    return [ document ];
  }

  return document.querySelectorAll(selector);
}

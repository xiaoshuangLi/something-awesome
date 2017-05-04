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

  list.map(img => {
    load(img, () => {
      num++

      if(num >= len) {
        return cb && timeout(cb)
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
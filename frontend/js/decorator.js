let set = (target) => {
  let proto = target.prototype
  let keys = Object.getOwnPropertyNames(proto);

  for(let v = keys.length - 1; v >= 0; v --) {
    let key = keys[v]
    if(typeof proto[key] == 'function')
      proto[key] = log(proto[key])
  }
}

let log = (target, name, descriptor) => {
  let isFunc = typeof target == 'function';
  let func = isFunc ? target : descriptor.value

  let res = (...args) => {
    let res;

    try {
      res = func.apply(target, args)
    }

    catch(e) {
      console.error(e)
    }

    finally{
      console.log(res)
    }

    return res
  }

  if(isFunc) {
    return res
  }

  descriptor.value = res  
}

//装饰器/Decorator

@set
class Text {
  // @log
  add(a, b){
    return a + b;
  }

  // @log
  minus(c, e){
    return c - e
  }
}

var test = new Text()
test.add(1,2)
test.minus(1,2)


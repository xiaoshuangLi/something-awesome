function _isUndefined(val, func) {
  if(val === undefined) {
    return () => {
      return true;
    }
  }

  return func(val);
}

const min = (res) => {
   return _isUndefined(res, (res) => {
    res = Number(res);

    return (value) => {
      return value >= res;
    }
  })
}

const max = (res) => {
  return _isUndefined(res, (res) => {
    res = Number(res);

    return (value) => {
      return value <= res;
    }
  })
}

const minLength = (res) => {
  return _isUndefined(res, (res) => {
    res = Number(res);

    return (value) => {
      return value.length >= res;
    }
  })
}

const maxLength = (res) => {
  return _isUndefined(res, (res) => {
    res = Number(res);

    return (value) => {
      return value.length <= res;
    }
  })
}

const pattern = (res) => {
  return _isUndefined(res, (res) => {
    return (value) => {
      return res.test && res.test(value);
    }
  })
}

const required = (res) => {
  return _isUndefined(res, (res) => {
    return (value) => {
      if (!required) {
        return true;
      }

      return res !== undefined && res !== '';
    }
  })
}

export {
  min,
  max,
  minLength,
  maxLength,
  pattern,
  required,
};
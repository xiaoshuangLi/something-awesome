const defaultShaderType = [
  'VERTEX_SHADER',
  'FRAGMENT_SHADER',
];

function error(msg) {
  if (window.console) {
    if (window.console.error) {
      window.console.error(msg);
    } else if (window.console.log) {
      window.console.log(msg);
    }
  }
}

export function createProgram(gl, shaders, opt_attribs, opt_locations, opt_errorCallback) {
  const errFn = opt_errorCallback || error;
  const program = gl.createProgram();

  shaders.forEach((shader) => {
    gl.attachShader(program, shader);
  });

  if (opt_attribs) {
    opt_attribs.forEach((attriib, ndx) => {
      gl.bindAttribLocation(program, opt_locations ? opt_locations[ndx] : ndx, attriib);
    });
  }

  gl.linkProgram(program);

  const linked = gl.getProgramParameter(program, gl.LINK_STATUS);

  if (!linked) {
    const lastError = gl.getProgramInfoLog(program);
    errFn("Error in program linking:" + lastError);

    gl.deleteShader(program);
    return null;
  }

  return program;
}

export function loadShader(gl, shaderSource, shaderType, opt_errorCallback) {
  const errFn = opt_errorCallback || error;
  const shader = gl.createShader(shaderType);
  
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);

  const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

  if (!compiled) {
    const lastError = gl.getShaderInfoLog(shader);
    errFn("*** Error compiling shader '" + shader + "':" + lastError);
    gl.deleteShader(shader);

    return null;
  }

  return shader;
}

export function createProgramFromSources(gl, shaderSources, opt_attribs, opt_locations, opt_errorCallback) {
  const shaders = [];

  for (let v = 0; v < shaderSources.length; v += 1) {
    shaders.push(loadShader(gl, shaderSources[v], gl[defaultShaderType[v]], opt_errorCallback));
  }

  return createProgram(gl, shaders, opt_attribs, opt_locations, opt_errorCallback);
}

export function resizeCanvasToDisplaySize(canvas, multiplier = 1) {
  const width = canvas.clientWidth * multiplier || 0;
  const height = canvas.clientHeight * multiplier || 0;

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;

    return true;
  }

  return false;
}
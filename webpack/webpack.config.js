var path = require('path');
var webpack = require('webpack');
var config = require('./webpack.config.dev');

var threePlugin = new webpack.ProvidePlugin({
  'THREE': 'three',
});

var threeAlias = {
  'three/OrbitControls': path.join(__dirname, '../node_modules/three/examples/js/controls/OrbitControls.js'),
  'three/CinematicCamera': path.join(__dirname, '../node_modules/three/examples/js/cameras/CinematicCamera.js'),
  'three/BokehShader2': path.join(__dirname, '../node_modules/three/examples/js/shaders/BokehShader2'),
  'three/DecalGeometry': path.join(__dirname, '../node_modules/three/examples/js/geometries/DecalGeometry'),
};

var assign = function(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t];
    for (var r in n)
      Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
  }
  return e
}

config.resolve = config.resolve || {};
config.resolve.alias = config.resolve.alias || {};
config.resolve.alias = assign({}, config.resolve.alias, threeAlias);
config.plugins.push(threePlugin)

module.exports = config;
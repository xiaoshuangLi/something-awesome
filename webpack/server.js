require('dotenv').config({ silent: true });
require('./server.babel');

if (global.env === 'production') {
  process.env.NODE_ENV = 'production';
}

var WebpackIsomorphicTools = require('webpack-isomorphic-tools');
global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('./webpack/webpack-isomorphic-tools'))
  .server(__dirname, function() {
    require('./server/server');
  });

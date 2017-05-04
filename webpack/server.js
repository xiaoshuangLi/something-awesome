// require('dotenv').config({ silent: true });
require('./webpack/webpack.config')
require('./server.babel');

var WebpackIsomorphicTools = require('webpack-isomorphic-tools');
global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('./webpack/webpack-isomorphic-tools'))
  .server(__dirname, function() {
    require('./server/server');
  });

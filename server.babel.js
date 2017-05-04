//  enable runtime transpilation to use ES6/7 in node

var babelConfig = require('./babel.json');
delete babelConfig.env;

require('babel-register')(babelConfig);

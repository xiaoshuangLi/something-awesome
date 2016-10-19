var requireDir = require('require-dir');
var _ = require('lodash');

var defualt = {
  prefix: '',
  development: true,
  frontPath: __dirname
};
global.gulpOptions = _.assign(defualt, global.gulpOptions);

requireDir('./gulp/tasks', { recurse: true });

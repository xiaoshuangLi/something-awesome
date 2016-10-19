require('dotenv').config({ silent: true });
var requireDir = require('require-dir');

global.gulpOptions = {
  development: true,
  backPath: __dirname,
  prefix: 'front:',
  image: false,
  media: false,
  lib: false,
  watchLite: Boolean(process.env.GULP_WATCH_LITE),
  sourcemap: Boolean(process.env.GULP_SOURCEMAP),
  rename: Boolean(process.env.GULP_RENAME)
};

require('./frontend/gulpfile');
requireDir('./gulp/tasks', { recurse: true });

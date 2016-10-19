
var config = require('../config').lib;

var gulp = require('gulp');

gulp.task(global.gulpOptions.prefix + 'lib', function (cb) {
  if (global.gulpOptions.lib) {
    gulp.src(config.src)
      .pipe(gulp.dest(config.dest))
      .on('end', cb);
  } else {
    cb();
  }
});

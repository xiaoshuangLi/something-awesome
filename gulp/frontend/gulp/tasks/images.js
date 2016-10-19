
var config = require('../config').images;

var gulp = require('gulp');

gulp.task(global.gulpOptions.prefix + 'images', function (cb) {
  if (global.gulpOptions.images) {
    gulp.src(config.src)
      .pipe(gulp.dest(config.dest))
      .on('end', cb);
  } else {
    cb();
  }
});

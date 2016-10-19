
var config = require('../config').media;

var gulp = require('gulp');

gulp.task(global.gulpOptions.prefix + 'media', function (cb) {
  if (global.gulpOptions.media) {
    gulp.src(config.src)
      .pipe(gulp.dest(config.dest))
      .on('end', cb);
  } else {
    cb();
  }
});

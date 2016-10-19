
var config = require('../config').tpl;

var gulp = require('gulp');
var watch = require('gulp-watch');

gulp.task(global.gulpOptions.prefix + 'tpl', function () {
  return gulp.src(config.src)
    .pipe(gulp.dest(config.dest));
});

gulp.task(global.gulpOptions.prefix + 'watch:tpl', function () {
  return watch(config.src, {
    name: global.gulpOptions.prefix + 'watch:tpl',
    verbose: true
  })
    .pipe(gulp.dest(config.dest));
});

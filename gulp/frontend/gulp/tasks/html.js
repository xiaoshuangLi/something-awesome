
var config = require('../config').html;

var gulp = require('gulp');
var fileInclude = require('gulp-file-include');
var watch = require('gulp-watch');

gulp.task(global.gulpOptions.prefix + 'html', function () {
  return gulp.src(config.src)
    .pipe(fileInclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest(config.dest));
});

gulp.task(global.gulpOptions.prefix + 'watch:html', function () {
  return watch(config.src, {
    name: global.gulpOptions.prefix + 'watch:html',
    verbose: true
  })
    .pipe(fileInclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest(config.dest));
});

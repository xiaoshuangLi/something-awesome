
var config = require('../config').script;

var gulp = require('gulp');
var watch = require('gulp-watch');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task(global.gulpOptions.prefix + 'script', function () {
  var src = gulp.src(config.src);
  if (global.gulpOptions.sourcemap) {
    src = src.pipe(sourcemaps.init());
  }
  if (!global.gulpOptions.development) {
    src = src.pipe(uglify());
  }
  if (global.gulpOptions.rename) {
    src = src.pipe(rename({ extname: '.min.js' }));
  }
  if (global.gulpOptions.sourcemap) {
    src = src.pipe(sourcemaps.write('./'));
  }
  src = src.pipe(gulp.dest(config.dest));
  return src;
});

gulp.task(global.gulpOptions.prefix + 'watch:script', function () {
  return watch(config.src, {
    name: global.gulpOptions.prefix + 'watch:script',
    verbose: true
  })
    .pipe(gulp.dest(config.dest));
});


var config = require('../config').css;

var gulp = require('gulp');
var watch = require('gulp-watch');
var sourcemaps = require('gulp-sourcemaps');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');

gulp.task(global.gulpOptions.prefix + 'css', function () {
  var src = gulp.src(config.src);
  if (global.gulpOptions.sourcemap) {
    src = src.pipe(sourcemaps.init());
  }
  if (!global.gulpOptions.development) {
    src = src.pipe(cleanCSS());
  }
  if (global.gulpOptions.rename) {
    src = src.pipe(rename({ extname: '.min.css' }));
  }
  if (global.gulpOptions.sourcemap) {
    src = src.pipe(sourcemaps.write('./'));
  }
  src = src.pipe(gulp.dest(config.dest));
  return src;
});

gulp.task(global.gulpOptions.prefix + 'watch:css', function () {
  return watch(config.src, {
    name: global.gulpOptions.prefix + 'watch:csscss',
    verbose: true
  })
  .pipe(gulp.dest(config.dest));
});

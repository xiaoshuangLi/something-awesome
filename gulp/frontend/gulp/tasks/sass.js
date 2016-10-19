
var config = require('../config').sass;

var gulp = require('gulp');
var watch = require('gulp-watch');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var plumber = require('gulp-plumber');

var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');

var handleErrors = require('./plumber');

gulp.task(global.gulpOptions.prefix + 'sass', function () {
  var processors = [
    autoprefixer,
    cssnano
  ];
  var src = gulp.src(config.src)
    .pipe(plumber(handleErrors))
    .pipe(sass())
    .pipe(postcss(processors));
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

gulp.task(global.gulpOptions.prefix + 'watch:sass.lite', function () {
  return watch(config.src, {
    name: global.gulpOptions.prefix + 'watch:sass',
    verbose: true
  })
    .pipe(sass())
    .pipe(gulp.dest(config.dest));
});

gulp.task(global.gulpOptions.prefix + 'watch:sass', function () {
  return gulp.watch(config.src, [global.gulpOptions.prefix + 'sass']);
});

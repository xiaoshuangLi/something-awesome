var config = require('../config');

var gulp = require('gulp');
var gulpSequence = require('gulp-sequence');


gulp.task('cp:views', function () {
  return gulp
    .src(config.views.dist)
    .pipe(gulp.dest(config.views.public));
});

gulp.task('cp:tpl', function () {
  return gulp
    .src(config.tpl.dist)
    .pipe(gulp.dest(config.tpl.public));
});

gulp.task('cp:css', function () {
  return gulp
    .src(config.css.dist)
    .pipe(gulp.dest(config.css.public));
});

gulp.task('cp:script', function () {
  return gulp
    .src(config.script.dist)
    .pipe(gulp.dest(config.script.public));
});

gulp.task('cp:images', function (cb) {
  if (!global.gulpOptions.images) {
    return cb();
  }
  gulp
    .src(config.images.dist)
    .pipe(gulp.dest(config.images.public))
    .on('end', cb);
});

gulp.task('cp:media', function (cb) {
  if (!global.gulpOptions.media) {
    return cb();
  }
  gulp
    .src(config.media.dist)
    .pipe(gulp.dest(config.media.public))
    .on('end', cb);
});

gulp.task('cp:lib', function (cb) {
  if (!global.gulpOptions.lib) {
    return cb();
  }
  gulp
    .src(config.lib.dist)
    .pipe(gulp.dest(config.lib.public))
    .on('end', cb);
});


gulp.task('cp', gulpSequence([
  'cp:views',
  'cp:css',
  'cp:script',
  'cp:tpl',
  'cp:images',
  'cp:media',
  'cp:lib'
]));

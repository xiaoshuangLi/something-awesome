var config = require('../config');

var gulp = require('gulp');
var gulpSequence = require('gulp-sequence');
var watch = require('gulp-watch');

gulp.task('watch:views', function () {
  if (global.gulpOptions.bsStream) {
    return watch(config.views.dist, { name: 'watch:views', verbose: true })
      .pipe(gulp.dest(config.views.public))
      .pipe(global.gulpOptions.bsStream());
  } else {
    return watch(config.views.dist, { name: 'watch:views', verbose: true })
      .pipe(gulp.dest(config.views.public));
  }
});

gulp.task('watch:css', function () {
  if (global.gulpOptions.bsStream) {
    return watch(config.css.dist, { name: 'watch:css', verbose: true })
      .pipe(gulp.dest(config.css.public))
      .pipe(global.gulpOptions.bsStream());
  } else {
    return watch(config.css.dist, { name: 'watch:css', verbose: true })
      .pipe(gulp.dest(config.css.public));
  }
});

gulp.task('watch:script', function () {
  if (global.gulpOptions.bsStream) {
    return watch(config.script.dist, { name: 'watch:script', verbose: true })
      .pipe(gulp.dest(config.script.public))
      .pipe(global.gulpOptions.bsStream());
  } else {
    return watch(config.script.dist, { name: 'watch:script', verbose: true })
      .pipe(gulp.dest(config.script.public));
  }
});

gulp.task('watch:tpl', function () {
  if (global.gulpOptions.bsStream) {
    return watch(config.tpl.dist, { name: 'watch:tpl', verbose: true })
      .pipe(gulp.dest(config.tpl.public))
      .pipe(global.gulpOptions.bsStream());
  } else {
    return watch(config.tpl.dist, { name: 'watch:tpl', verbose: true })
      .pipe(gulp.dest(config.tpl.public));
  }
});

gulp.task('watch', gulpSequence([
  'watch:views',
  'watch:tpl',
  'watch:css',
  'watch:script'
]));

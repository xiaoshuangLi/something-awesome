
var config = require('../config').nodemon;

var gulp = require('gulp');
var gulpSequence = require('gulp-sequence');
var nodemon = require('gulp-nodemon');

gulp.task(global.gulpOptions.prefix + 'default', function (cb) {
  console.info('check gulp task. such as "gulp develop"');
  cb();
});

gulp.task(global.gulpOptions.prefix + 'build', gulpSequence([
  global.gulpOptions.prefix + 'html',
  global.gulpOptions.prefix + 'css',
  global.gulpOptions.prefix + 'sass',
  global.gulpOptions.prefix + 'script',
  // global.gulpOptions.prefix + 'react',
  // global.gulpOptions.prefix + 'browserify',
  global.gulpOptions.prefix + 'tpl',
  global.gulpOptions.prefix + 'lib',
  global.gulpOptions.prefix + 'images',
  global.gulpOptions.prefix + 'media'
]));

gulp.task(global.gulpOptions.prefix + 'nodemon', function (cb) {
  var started = false;
  nodemon(config)
    .on('start', function () {
      if (!started) {
        cb();
        started = true;
      }
    })
    .on('restart', function () {
      console.info('restarted!');
    });
});

gulp.task(global.gulpOptions.prefix + 'develop',
  gulpSequence(global.gulpOptions.prefix + 'watch', global.gulpOptions.prefix + 'nodemon'));

gulp.task(global.gulpOptions.prefix + 'developP',
  gulpSequence(global.gulpOptions.prefix + 'watchPlus', global.gulpOptions.prefix + 'nodemon'));

var config = require('../config').nodemon;

var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

gulp.task('nodemon', function (cb) {
  var started = false;
  nodemon(config)
    .on('start', function () {
      if (!started) {
        setTimeout(function () {
          cb();
          started = true;
        }, 2000);
      }
    })
    .on('restart', function () {
      console.info('restarted!');
    });
});

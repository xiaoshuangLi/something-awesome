var port = require('../config').serverPort;

var gulp = require('gulp');
var browserSync = require('browser-sync').create();

gulp.task('browser-sync', ['nodemon'], function () {
  global.gulpOptions.bs = browserSync;
  global.gulpOptions.browserSync = browserSync;
  global.gulpOptions.bsReload = browserSync.reload;
  global.gulpOptions.bsStream = browserSync.stream;
  browserSync.init({
    open: false,
    proxy: 'http://localhost:' + port
  });
});

gulp.task('bs-reload', function () {
  browserSync.reload();
});


var gulp = require('gulp');
var browserifyTask = require('./browserify');

gulp.task(global.gulpOptions.prefix + 'watchify', function (callback) {
  browserifyTask(callback, true);
});

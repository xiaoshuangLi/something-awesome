var gulp = require('gulp');
var gulpSequence = require('gulp-sequence');

gulp.task('setOptions:prepare', function (cb) {
  global.gulpOptions.image = true;
  global.gulpOptions.media = true;
  global.gulpOptions.lib = true;
  cb();
});

gulp.task('setOptions:prepareUgly', function (cb) {
  global.gulpOptions.development = false;
  cb();
});

gulp.task('prepareLite', gulpSequence(global.gulpOptions.prefix + 'build', 'cp'));

gulp.task('prepare', gulpSequence('setOptions:prepare', global.gulpOptions.prefix + 'build', 'cp'));

gulp.task('prepareLiteUgly', gulpSequence(
  'setOptions:prepareUgly',
  global.gulpOptions.prefix + 'build', 'cp'));

gulp.task('prepareUgly', gulpSequence(
  'setOptions:prepare', 'setOptions:prepareUgly',
  global.gulpOptions.prefix + 'build', 'cp'));

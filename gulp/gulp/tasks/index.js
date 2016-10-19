
var gulp = require('gulp');
var gulpSequence = require('gulp-sequence');

gulp.task('default', function (cb) {
  console.info('check gulp task. such as "gulp [develop, developFS, developFSS, developFSSP]"');
  cb();
});

// developFullStackSyncPlus
gulp.task('developFSSP', gulpSequence('browser-sync', [global.gulpOptions.prefix + 'watchPlus', 'watch']));

// developFullStackSync
gulp.task('developFSS', gulpSequence('browser-sync', [global.gulpOptions.prefix + 'watch', 'watch']));

// developFullStackPlus
gulp.task('developFSP', gulpSequence('nodemon', [global.gulpOptions.prefix + 'watchPlus', 'watch']));

// developFullStack
gulp.task('developFS', gulpSequence('nodemon', [global.gulpOptions.prefix + 'watch', 'watch']));

gulp.task('develop', ['nodemon']);

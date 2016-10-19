
var gulp = require('gulp');
var eslint = require('gulp-eslint');

gulp.task(global.gulpOptions.prefix + 'lint', function () {
  return gulp.src('src/js/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task(global.gulpOptions.prefix + 'lint.node', function () {
  return gulp.src(['gulp/**/*.js', '*.js'])
    .pipe(eslint('./.eslintrc.node.json'))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task(global.gulpOptions.prefix + 'lint.react', function () {
  return gulp.src('src/react/**/*.jsx')
    .pipe(eslint('./.eslintrc.react.json'))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

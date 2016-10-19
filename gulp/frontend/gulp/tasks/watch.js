
var gulp = require('gulp');
var gulpSequence = require('gulp-sequence');

if (global.gulpOptions.watchLite) {
  gulp.task(global.gulpOptions.prefix + 'watch',
    gulpSequence([
      global.gulpOptions.prefix + 'watch:html',
      global.gulpOptions.prefix + 'watch:tpl',
      global.gulpOptions.prefix + 'watch:css',
      global.gulpOptions.prefix + 'watch:sass.lite',
      global.gulpOptions.prefix + 'watch:script',
      global.gulpOptions.prefix + 'watch:tpl'
    ]));
} else {
  gulp.task(global.gulpOptions.prefix + 'watch', [global.gulpOptions.prefix + 'watch:sass'],
    gulpSequence([
      global.gulpOptions.prefix + 'watch:html',
      global.gulpOptions.prefix + 'watch:tpl',
      global.gulpOptions.prefix + 'watch:css',
      global.gulpOptions.prefix + 'watch:script',
      global.gulpOptions.prefix + 'watch:tpl'
    ]));
}

gulp.task(global.gulpOptions.prefix + 'watchPlus', gulpSequence([
  global.gulpOptions.prefix + 'watch',
  global.gulpOptions.prefix + 'watch:react',
  global.gulpOptions.prefix + 'watchify'
]));

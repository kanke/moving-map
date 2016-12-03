var gulp = require('gulp');

gulp.task('build', function() {
  console.log('build started...');

  console.log('build finished.');
});

gulp.task('default', ['build']);

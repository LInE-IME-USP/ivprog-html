var gulp = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    clean = require('gulp-clean'),
    connect = require('gulp-connect');

// JSHint task
gulp.task('lint', function() {
  gulp.src('./app/scripts/*.js')
  .pipe(jshint())
  // You can look into pretty reporters as well, but that's another story
  .pipe(jshint.reporter('default'));
});

// Browserify task
gulp.task('browserify', function() {
  // Single point of entry (make sure not to src ALL your files, browserify will figure it out for you)
  gulp.src(['app/scripts/main.js'])
  .pipe(browserify({
    insertGlobals: true,
    debug: true
  }))
  // Bundle to a single file
  .pipe(concat('bundle.js'))
  // Output it to our dist folder
  .pipe(gulp.dest('dist/js'));
});

gulp.task('connect', function() {
  connect.server();
});

gulp.task('watch', ['connect', 'lint'], function() {

  gulp.task('html', function () {
    gulp.src('./src/*.html')
      .pipe(connect.reload());
  });

  // Watch our scripts
  gulp.watch(['./src/*.html', 'app/scripts/*.js', 'app/scripts/**/*.js'],[
    'lint',
    'browserify',
    'html'
  ]);
});

gulp.task('default', ['watch']);

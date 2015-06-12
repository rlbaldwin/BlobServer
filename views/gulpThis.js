var gulp = require('gulp');
var jade = require('gulp-jade');
var data = require('gulp-data');
var path = require('path');
var fs   = require('fs');

gulp.task('jade', function() {
  return gulp.src('*.jade')
    .pipe(data(function(file) {
      return require('./myData.json');
    }))
    .pipe(jade({ pretty: true }))
    .pipe(gulp.dest('build/'));
});
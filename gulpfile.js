var gulp = require('gulp');
var server = require('gulp-express');
var mocha = require('gulp-mocha');
var util = require('gulp-util');
var istanbul = require('gulp-istanbul');
var jshint = require('gulp-jshint');
 
gulp.task('server', function () {
    // Start the server at the beginning of the task 
    server.run(['app.js']);
    
    gulp.watch(['app.js', 'src/**/*.js'], [server.run]);
});

gulp.task('test' , function () {
    return gulp.src(['test/**/*.js'], { read: false })
        .pipe(mocha({ reporter: 'spec' }))
        .on('error', util.log);
});


gulp.task('pre-test', () =>
  gulp.src([
    'src/**/*.js'
  ])
    .pipe(istanbul({includeUntested: true}))
    .pipe(istanbul.hookRequire())
);

gulp.task('testing', ['pre-test'], cb => {
  let mochaErr;

  gulp.src('test/*.js')
    .pipe(mocha({reporter: 'spec'}))
    .on('error', err => {
      mochaErr = err;
    })
    .pipe(istanbul.writeReports())
    .on('end', () => {
      cb(mochaErr);
    });
});


gulp.task('lint', function() {
  return gulp.src(['src/**/*.js', 'test/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});
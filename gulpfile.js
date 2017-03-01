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


gulp.task('testing', function (cb) {
  gulp.src(['src/**/*.js'])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire()) 
    .on('finish', function () {
      gulp.src(['test/**/*.js'])
        .pipe(mocha({ reporter: 'spec' }))
	.pipe(istanbul.writeReports())
	.pipe(istanbul.enforceThresholds({ thresholds: { global: 10 } }))
	.on('end', cb);
    });
});


gulp.task('lint', function() {
  return gulp.src(['src/**/*.js', 'test/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});
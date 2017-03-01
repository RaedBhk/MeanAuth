var gulp = require('gulp');
var server = require('gulp-express');
var mocha = require('gulp-mocha');
var util = require('gulp-util');
 
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

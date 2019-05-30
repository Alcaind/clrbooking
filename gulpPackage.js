'use strict';

var autoprefixer = require('gulp-autoprefixer');
var csso = require('gulp-csso');
var del = require('del');
var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var runSequence = require('run-sequence');

var uglify = require('gulp-uglify');

gulp.task('compress', function () {
    gulp.src('./app/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('minapp'))
});
/**
 * Created by Michael on 10/5/2014.
 */
'use strict';

var gulp = require('gulp');
var less = require('gulp-less');
var handleErrors = require('../util/handleErrors');
var config = require('../config').less;

gulp.task('watch-less', ['watch-images'], function () {
    return gulp.src(config.src)
        .pipe(less())
        .on('error', handleErrors)
        .pipe(gulp.dest(config.dest));
});

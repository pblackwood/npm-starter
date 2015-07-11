/**
 * Created by Michael on 10/5/2014.
 */
'use strict';

var gulp = require('gulp');
var less = require('gulp-less');
var handleErrors = require('../util/handleErrors');
var config = require('../config').less;

gulp.task('less', ['images', 'clean'], function () {
    return gulp.src(config.main)
        .pipe(less())
        .on('error', handleErrors)
        .pipe(gulp.dest(config.dest));
});

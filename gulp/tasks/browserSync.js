/**
 * Created by Michael on 10/5/2014.
 */
'use strict';

var browserSync = require('browser-sync');
var gulp = require('gulp');
var config = require('../config').browserSync;

gulp.task('browserSync', ['build'], function () {
    browserSync(config);
});

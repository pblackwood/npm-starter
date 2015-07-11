/**
 * Created by Michael on 10/5/2014.
 */
'use strict';

var gulp = require('gulp');
var del = require('del');
var config = require('../config').core;

gulp.task('clean', function (cb) {
    del([config.dist], cb);
});
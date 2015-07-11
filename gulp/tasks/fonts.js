/**
 * Created by mlashins on 10/14/2014.
 */
'use strict';
var gulp = require('gulp');
var config = require('../config').fonts;
var changed = require('gulp-changed');

gulp.task('fonts', ['clean'], function () {
    return gulp.src(config.src)
        .pipe(changed(config.dest))
        .pipe(gulp.dest(config.dest));
});

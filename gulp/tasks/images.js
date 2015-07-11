/**
 * Created by Michael on 10/5/2014.
 */
'use strict';

var gulp = require('gulp');
var changed = require('gulp-changed');
var config = require('../config').images;

gulp.task('images', ['clean'], function () {
    return gulp.src(config.src)
        .pipe(changed(config.dest))
        .pipe(gulp.dest(config.dest));
});

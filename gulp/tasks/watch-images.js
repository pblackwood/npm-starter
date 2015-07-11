/**
 * Created by Michael on 10/5/2014.
 */
'use strict';

var changed = require('gulp-changed');
var gulp = require('gulp');
var config = require('../config').images;

gulp.task('watch-images', function () {
    return gulp.src(config.src)
        .pipe(changed(config.dest))
        .pipe(gulp.dest(config.dest));
});

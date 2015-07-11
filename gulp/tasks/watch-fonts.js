/**
 * Created by Michael on 10/5/2014.
 */
'use strict';

var gulp = require('gulp');
var config = require('../config').fonts;

gulp.task('watch-fonts', function () {
    return gulp.src(config.src)
        .pipe(gulp.dest(config.dest));
});

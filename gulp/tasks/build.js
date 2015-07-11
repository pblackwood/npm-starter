/**
 * Created by Michael on 10/5/2014.
 */
'use strict';

var gulp = require('gulp');

gulp.task('build', ['clean', 'browserify', 'less', 'images', 'markup', 'fonts', 'props']);

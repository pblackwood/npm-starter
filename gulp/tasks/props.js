var gulp = require('gulp');
var config = require('../config').props;

gulp.task('props', ['clean'], function () {
    return gulp.src(config.src).
        pipe(gulp.dest(config.dest));
});

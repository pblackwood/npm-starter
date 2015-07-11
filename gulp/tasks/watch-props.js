var gulp = require('gulp');
var config = require('../config').props;

gulp.task('watch-props', function () {
    return gulp.src(config.src)
        .pipe(gulp.dest(config.dest));
});

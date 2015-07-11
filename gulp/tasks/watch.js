var gulp = require('gulp');
var config = require('../config');

gulp.task('watch', ['clean', 'build', 'setWatch', 'browserSync'], function () {
    gulp.watch(config.less.src, ['watch-less']);
    gulp.watch(config.images.src, ['watch-images']);
    gulp.watch(config.markup.src, ['watch-markup']);
    gulp.watch(config.fonts.src, ['watch-fonts']);
    gulp.watch(config.props.src, ['watch-props']);
});

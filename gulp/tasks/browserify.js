/**
 * Created by Michael on 10/5/2014.
 */
'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var watchify = require('watchify');
var bundleLogger = require('../util/bundleLogger');
var handleErrors = require('../util/handleErrors');
var source = require('vinyl-source-stream');
var config = require('../config').browserify;
var reactify = require('reactify');

gulp.task('browserify', ['clean'], function (callback) {

    var bundleQueue = config.bundleConfigs.length;

    var browserifyThis = function (bundleConfig) {

        var bundler = browserify({
            cache: {},
            packageCache: {},
            fullPaths: false,
            entries: bundleConfig.entries,
            extensions: config.extensions,
            debug: config.debug,
            insertGlobals: false,
            transform: ['reactify']
        });

        var bundle = function () {
            bundleLogger.start(bundleConfig.outputName);

            return bundler
                .bundle()
                .on('error', handleErrors)
                .pipe(source(bundleConfig.outputName))
                .pipe(gulp.dest(bundleConfig.dest))
                .on('end', reportFinished);
        };

        if (global.isWatching) {
            bundler = watchify(bundler);
            bundler.on('update', bundle);
        }

        var reportFinished = function () {
            bundleLogger.end(bundleConfig.outputName);

            if (bundleQueue) {
                bundleQueue--;
                if (bundleQueue === 0) {
                    callback();
                }
            }
        };

        return bundle();
    };

    config.bundleConfigs.forEach(browserifyThis);
});

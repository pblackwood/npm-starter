/**
 * Created by Michael on 10/5/2014.
 */
'use strict';

var notify = require("gulp-notify");

module.exports = function () {

    var args = Array.prototype.slice.call(arguments);

    notify.onError({
        title: "Compile Error",
        message: "<%= error.message %>"
    }).apply(this, args);

    this.emit('end');
};
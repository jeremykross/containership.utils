'use strict';

module.exports.expandUserPath = function(path) {
    if (!path || path.indexOf('~') !== 0) {
        return path;
    }

    return path.replace('~', process.env.HOME);
}

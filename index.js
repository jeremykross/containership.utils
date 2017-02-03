'use strict';

const _ = require('lodash');

module.exports.expandUserPath = function(path) {
    if (!path || path.indexOf('~') !== 0) {
        return path;
    }

    return path.replace('~', process.env.HOME);
}

module.exports.isDefined = function(x) {
    return x !== null && x !== undefined;
}

module.exports.hasAllKeys = function(object, ...keys) {
    if (typeof object !== 'object') {
        return false;
    }

    // ensure we have flat level array
    keys = [].concat.apply([], keys);

    let result = true;

    keys:
    for (let x = 0, size_x = keys.length; x < size_x; x++) {
        let temp = object;
        const parts = keys[x].split('.');

        for(let y = 0, size_y = parts.length; y < size_y; y++) {
            const part = parts[y];

            if (!module.exports.isDefined(temp[part])) {
                result = false;
                break keys;
            }

            temp = temp[part];
        }
    }

    return result;

}

module.exports.ifAcceptableResponseFn = function(onError, isAcceptable) {
    isAcceptable = isAcceptable || _.constant(true);

    return (cb, options) => {
        return (err, res) => {
            if(err || !isAcceptable(res)) {
                return onError(err, res, options);
            } else {
                return cb(res, options);
            }
        }
    }
}




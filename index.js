'use strict';

module.exports.expandUserPath = function(path) {
    if (!path || path.indexOf('~') !== 0) {
        return path;
    }

    return path.replace('~', process.env.HOME);
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

            if (temp[part] === null || temp[part] === undefined) {
                result = false;
                break keys;
            }

            temp = temp[part];
        }
    }

    return result;
}

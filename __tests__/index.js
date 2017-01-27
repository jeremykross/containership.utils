'use strict';

const csUtils = require('../index');

import test from 'ava';

test('expandUserPath: should succesfully expand ~ if it is the start of a path', t => {
    const testPath = '~/this/is/a/path';
    const resultPath = csUtils.expandUserPath(testPath);
    t.is(resultPath, `${process.env.HOME}${testPath.substring(1)}`);
});

test('expandUserPath: should ignore expansion of ~ if it is not the start of a path', t => {
    const testPath = '/this/is/~a/path';
    const resultPath = csUtils.expandUserPath(testPath);
    t.is(resultPath, testPath);
});

test('expandUserPath: should return passed in path if it does not contain a ~', t => {
    const testPath = '/this/is/a/path';
    const resultPath = csUtils.expandUserPath(testPath);
    t.is(resultPath, testPath);
});

test('expandUserPath: should return null or undefined if that is passed in', t => {
    const testPathNull = null;
    let resultPath = csUtils.expandUserPath(testPathNull);
    t.is(resultPath, testPathNull);

    const testPathUndf = undefined;
    resultPath = csUtils.expandUserPath(testPathUndf);
    t.is(resultPath, testPathUndf);
});

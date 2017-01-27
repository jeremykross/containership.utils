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

test('hasAllKeys: should return true with single level', t => {
    const testObject = {
        a: 'valueA',
        b: 'valueB'
    };

    t.true(csUtils.hasAllKeys(testObject, 'a'));
    t.true(csUtils.hasAllKeys(testObject, 'b'));
    t.true(csUtils.hasAllKeys(testObject, ['a', 'b']));
    t.true(csUtils.hasAllKeys(testObject, 'a', 'b'))
});

test('hasAllKeys: nested level test', t => {
    const testObject = {
        a: {
            b: 'valueAB',
            c: 'valueAC'
        },
        b: 'valueB'
    };

    t.true(csUtils.hasAllKeys(testObject, 'a'));
    t.true(csUtils.hasAllKeys(testObject, 'a.b'));
    t.true(csUtils.hasAllKeys(testObject, 'a.c'));
    t.true(csUtils.hasAllKeys(testObject, 'b'));
    t.true(csUtils.hasAllKeys(testObject, 'a', 'b', 'a.b', 'a.c'));
});

test('hasAllKeys: unknown key passed', t => {
    const testObject = {
        a: {
            b: 'valueAB',
            c: 'valueAC'
        },
        b: 'valueB'
    };

    t.false(csUtils.hasAllKeys(testObject, 'bad'));
    t.false(csUtils.hasAllKeys(testObject, 'a.bad'));
    t.false(csUtils.hasAllKeys(testObject, 'a.b.bad'));
});

test('hasAllKeys: null/undefined', t => {
    const testObject = {
        a: {
            b: null,
            c: undefined
        }
    };

    t.false(csUtils.hasAllKeys(testObject, 'a.b'));
    t.false(csUtils.hasAllKeys(testObject, 'a.c'));
});

test('isDefined: for null/undefined', t => {
    t.false(csUtils.isDefined(null));
    t.false(csUtils.isDefined(undefined));

    let hello;
    t.false(csUtils.isDefined(hello));
});

test('isDefined: for values', t => {
    t.true(csUtils.isDefined(123));
    t.true(csUtils.isDefined("123"));
    t.true(csUtils.isDefined({}));
    t.true(csUtils.isDefined([]));
});

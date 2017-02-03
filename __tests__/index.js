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

(() => {

    const errorHandler = (err, res, options) => {
        return `I received an err ${err} or an unacceptable response ${res} with options ${options}.`;
    };

    const callback = (res, options) => {
        return `I received a successful response ${res} with options ${options}.`;
    };


    test('ifAcceptableResponseFn: accepts all by default', t => {

        const acceptAllNonErrorResponses = csUtils.ifAcceptableResponseFn(errorHandler)(callback);

        t.is(
            acceptAllNonErrorResponses(null, 2),
            callback(2));
        t.is(
            acceptAllNonErrorResponses(null, 3),
            callback(3));
        t.is(
            acceptAllNonErrorResponses(new Error("ERROR"), 1),
            errorHandler(new Error("ERROR"), 1));
    });


    test('ifAcceptableResponseFn: handles even responses correctly (with options)', t => {

        const acceptEvenResponses = csUtils.ifAcceptableResponseFn(errorHandler, (res) => {
            return res % 2 == 0;
        })(callback, "FOO");

        t.is(
            acceptEvenResponses(null, 2),
            callback(2, "FOO"));
        t.is(
            acceptEvenResponses(null, 3),
            errorHandler(null, 3, "FOO"));
        t.is(
            acceptEvenResponses(new Error("ERROR"), 2),
            errorHandler(new Error("ERROR"), 2, "FOO"));
    });

    test('ifAcceptableResponseFn: handles odd responses correctly', t => {
        const acceptOddResponses = csUtils.ifAcceptableResponseFn(errorHandler, (res) => {
            return res % 2 != 0;
        })(callback);

        t.is(
            acceptOddResponses(null, 2),
            errorHandler(null, 2));
        t.is(
            acceptOddResponses(null, 3),
            callback(3));
        t.is(
            acceptOddResponses(new Error("ERROR"), 1),
            errorHandler(new Error("ERROR"), 1));
    });

})();

import { isObject } from '../src/utils';

describe('utils', () => {
    describe('isObject', () => {
        test.each([
            ['returns true for an object', {}, true],
            ['returns false for an array', [], false],
            ['returns false for a string', 'hello', false],
            ['returns false for a primitive', 1, false],
        ])('%s', (title, val, expected) => {
            const result = isObject(val);
            expect(result).toEqual(expected);
        });
    });
});

var assert = require('assert');
var fs = require('fs');
var PO = require('..');

describe('.parsePluralForms()', function () {
    it('should return an object with empty nplurals and plural expression when there is no plural forms header', function () {
        var expected = {
            nplurals: undefined,
            plural: undefined
        };
        assert.deepEqual(PO.parsePluralForms(), expected);
        assert.deepEqual(PO.parsePluralForms(null), expected);
        assert.deepEqual(PO.parsePluralForms(''), expected);
    });

    it('should return an object with nplurals and plural set to xgettext\'s default output', function () {
        var pluralForms = 'nplurals=INTEGER; plural=EXPRESSION;';

        var expected = {
            nplurals: 'INTEGER',
            plural: 'EXPRESSION'
        };
        var actual = PO.parsePluralForms(pluralForms);
        assert.deepEqual(actual, expected);
    });

    it('should return an object with nplurals and plural set to typical string', function () {
        var pluralForms = 'nplurals=3; plural=(n==1 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2);';

        var expected = {
            nplurals: '3',
            plural: '(n==1 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2)'
        };
        var actual = PO.parsePluralForms(pluralForms);
        assert.deepEqual(actual, expected);
    });

    // node-gettext stores plural forms strings with spaces. They don't appear
    // to write PO files at all, but it seems prudent to handle this case
    // anyway. See
    // https://github.com/alexanderwallin/node-gettext/blob/v1.1.0/lib/plurals.js#L14
    it('should handle spaces around assignments in plural forms string', function () {
        var pluralForms = 'nplurals = 3; plural = (n==1 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2);';

        var expected = {
            nplurals: '3',
            plural: '(n==1 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2)'
        };
        var actual = PO.parsePluralForms(pluralForms);
        assert.deepEqual(actual, expected);
    });
});

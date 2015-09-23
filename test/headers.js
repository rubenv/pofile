var assert = require('assert');
var PO = require('..');

describe('Headers', function () {
    var po;

    before(function (done) {
        PO.load(__dirname + '/fixtures/big.po', function (err, result) {
            assert.equal(err, null);
            po = result;
            done();
        });
    });

    it('Parses the po file', function () {
        assert.notEqual(po, null);
    });

    it('Parses headers correctly', function () {
        assert.equal(po.headers['Project-Id-Version'], 'Link (6.x-2.9)');
        assert.equal(po.headers['MIME-Version'], '1.0');
        assert.equal(po.headers['Plural-Forms'], 'nplurals=2; plural=(n > 1);');
    });

    it('Parses all headers', function () {
        // There are 11 headers in the .po file, but some default headers
        // are defined (nr. 12 in this case is Report-Msgid-Bugs-To).
        assert.equal(Object.keys(po.headers).length, 12);
    });
});

describe('PO files with no headers', function () {

    it('Parses an empty string', function () {
        var po = PO.parse('');
        assert.notEqual(po, null);
        // all headers should be empty
        for (var key in po.headers) {
            assert.equal(po.headers[key], '');
        }
        assert.equal(po.items.length, 0);
    });

    it('Parses a minimal example', function () {
        var po = PO.parse('msgid "minimal PO"\nmsgstr ""');
        assert.notEqual(po, null);
        // all headers should be empty
        for (var key in po.headers) {
            assert.equal(po.headers[key], '');
        }
        assert.equal(po.items.length, 1);
    });

    describe('advanced example', function () {
        var po;

        before(function (done) {
            PO.load(__dirname + '/fixtures/no_header.po', function (err, result) {
                assert.equal(err, null);
                po = result;
                done();
            });
        });

        it('Parses the po file', function () {
            assert.notEqual(po, null);
        });

        it('Finds all items', function () {
            assert.equal(po.items.length, 2);
        });
    });
});

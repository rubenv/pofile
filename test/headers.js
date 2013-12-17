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

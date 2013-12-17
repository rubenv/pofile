var assert = require('assert');
var PO = require('..');

describe('Comments', function () {
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

    it('Parses the comments', function () {
        assert.equal(po.comments.length, 3);
        assert.equal(po.comments[0], 'French translation of Link (6.x-2.9)');
        assert.equal(po.comments[1], 'Copyright (c) 2011 by the French translation team');
        assert.equal(po.comments[2], '');
    });
});

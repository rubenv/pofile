var assert = require('assert');
var fs = require('fs');
var PO = require('..');

describe('Parse', function () {
    it('Parses the big po file', function () {
        var po = PO.parse(fs.readFileSync(__dirname + '/fixtures/big.po', 'utf8'));
        assert.notEqual(po, null);
        assert.equal(po.items.length, 67);
        
        var item = po.items[0];
        assert.equal(item.msgid, "Title");
        assert.equal(item.msgstr, "Titre");
    });

    it('Handles multi-line strings', function () {
        var po = PO.parse(fs.readFileSync(__dirname + '/fixtures/multi-line.po', 'utf8'));
        assert.notEqual(po, null);
        assert.equal(po.items.length, 1);
        
        var item = po.items[0];
        assert.equal(item.msgid, "The following placeholder tokens can be used in both paths and titles. When used in a path or title, they will be replaced with the appropriate values.");
        assert.equal(item.msgstr, "Les ébauches de jetons suivantes peuvent être utilisées à la fois dans les chemins et dans les titres. Lorsqu'elles sont utilisées dans un chemin ou un titre, elles seront remplacées par les valeurs appropriées.");
    });

    it('Handles string comments', function () {
        var po = PO.parse(fs.readFileSync(__dirname + '/fixtures/comment.po', 'utf8'));
        assert.notEqual(po, null);
        assert.equal(po.items.length, 1);
        
        var item = po.items[0];
        assert.equal(item.msgid, "Title, as plain text");
        assert.equal(item.msgstr, "Attribut title, en tant que texte brut");
        assert.deepEqual(item.comments, ["Comment"]);
    });
});

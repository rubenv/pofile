var assert = require('assert');
var fs = require('fs');
var PO = require('..');

function assertHasLine(str, line) {
    var lines = str.split('\n');
    var found = false;

    for (var i = 0; i < lines.length; i++) {
        if (lines[i].trim() === line) {
            found = true;
            break;
        }
    }

    assert(found, 'Could not find line: ' + line);
}

describe('Write', function () {
    it('write flags', function () {
        var input = fs.readFileSync(__dirname + '/fixtures/fuzzy.po', 'utf8');
        var po = PO.parse(input);
        var str = po.toString();
        assertHasLine(str, '#, fuzzy');
    });

    it('write msgid', function () {
        var input = fs.readFileSync(__dirname + '/fixtures/fuzzy.po', 'utf8');
        var po = PO.parse(input);
        var str = po.toString();
        assertHasLine(str, 'msgid "Sources"');
    });

    it('write msgstr', function () {
        var input = fs.readFileSync(__dirname + '/fixtures/fuzzy.po', 'utf8');
        var po = PO.parse(input);
        var str = po.toString();
        assertHasLine(str, 'msgstr "Source"');
    });

    it('write translator comment', function () {
        var input = fs.readFileSync(__dirname + '/fixtures/comment.po', 'utf8');
        var po = PO.parse(input);
        var str = po.toString();
        assertHasLine(str, '# Translator comment');
    });

    it('write extracted comment', function () {
        var input = fs.readFileSync(__dirname + '/fixtures/comment.po', 'utf8');
        var po = PO.parse(input);
        var str = po.toString();
        assertHasLine(str, '#. Extracted comment');
    });

    it('write obsolete items', function () {
        var input = fs.readFileSync(__dirname + '/fixtures/commented.po', 'utf8');
        var po = PO.parse(input);
        var str = po.toString();

        assertHasLine(str, '#~ msgid "Add order"');
        assertHasLine(str, '#~ msgstr "Order toevoegen"');
    });

    it('write obsolete items with comment', function () {
        var input = fs.readFileSync(__dirname + '/fixtures/commented.po', 'utf8');
        var po = PO.parse(input);
        var str = po.toString();

        //this is what msgcat tool of gettext does: don't print #~ for comments
        assertHasLine(str, '# commented obsolete item');
        assertHasLine(str, '#, fuzzy');

        //items made obsolete by commenting every keyword with #~
        assertHasLine(str, '#~ msgid "Commented item"');
        assertHasLine(str, '#~ msgstr "not sure"');
        assertHasLine(str, '#~ msgid "Second commented item"');
        assertHasLine(str, '#~ msgstr "also not sure"');
    });

    describe('C-Strings', function () {
        it('should escape "', function () {
            var item = new PO.Item();

            item.msgid = '" should be written escaped';
            assertHasLine(item.toString(), 'msgid "\\" should be written escaped"');
        });

        it('shoudl escape \\', function () {
            var item = new PO.Item();

            item.msgid = '\\ should be written escaped';
            assertHasLine(item.toString(), 'msgid "\\\\ should be written escaped"');
        });

        it('should escape \\n', function () {
            var item = new PO.Item();

            item.msgid = '\n should be written escaped';
            assertHasLine(item.toString(), 'msgid ""');
            assertHasLine(item.toString(), '""');
            assertHasLine(item.toString(), '" should be written escaped"');
        });

        it('should write identical file after parsing a file', function () {
            var input = fs.readFileSync(__dirname + '/fixtures/c-strings.po', 'utf8');
            var po = PO.parse(input);
            var str = po.toString();

            assert.equal(str, input);
        });
    });

    describe('msgctxt', function () {
        it('should write context field to file', function () {
            var input = fs.readFileSync(__dirname + '/fixtures/big.po', 'utf8');
            var po = PO.parse(input);
            var str = po.toString();
            assertHasLine(str, 'msgctxt "folder action"');
        });

        it('should ignore omitted context field', function () {
            var po = new PO();
            var item = new PO.Item();
            po.items.push(item);
            assert.ok(po.toString().indexOf('msgctxt') < 0);
        });

        it('should write empty context field', function () {
            var po = new PO();
            var item = new PO.Item();

            item.msgctxt = '';
            po.items.push(item);
            assert.ok(po.toString().indexOf('msgctxt') >= 0);
        });
    });
});

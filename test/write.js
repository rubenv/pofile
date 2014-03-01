var assert = require('assert');
var fs = require('fs');
var PO = require('..');

function assertHasLine(str, line) {
    var lines = str.split("\n");
    var found = false;

    for (var i = 0; i < lines.length; i++) {
        if (lines[i].trim() === line) {
            found = true;
            break;
        }
    }

    assert(found, "Could not find line: " + line);
}

describe('Write', function () {
    it('write flags', function () {
        var input = fs.readFileSync(__dirname + '/fixtures/fuzzy.po', 'utf8');
        var po = PO.parse(input);
        var str = po.toString();
        assertHasLine(str, "#, fuzzy");
    });

    it('write msgid', function () {
        var input = fs.readFileSync(__dirname + '/fixtures/fuzzy.po', 'utf8');
        var po = PO.parse(input);
        var str = po.toString();
        assertHasLine(str, "msgid \"Sources\"");
    });

    it('write msgstr', function () {
        var input = fs.readFileSync(__dirname + '/fixtures/fuzzy.po', 'utf8');
        var po = PO.parse(input);
        var str = po.toString();
        assertHasLine(str, "msgstr \"Source\"");
    });

    it('write translator comment', function () {
        var input = fs.readFileSync(__dirname + '/fixtures/comment.po', 'utf8');
        var po = PO.parse(input);
        var str = po.toString();
        assertHasLine(str, "# Comment");
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

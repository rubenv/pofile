var assert = require('assert');
var fs = require('fs');
var PO = require('..');

function assertHasLine(str, line, doNotTrim) {
    var lines = str.split('\n');
    var found = false;

    for (var i = 0; i < lines.length; i++) {
        var lineToCompare = doNotTrim ? lines[i] : lines[i].trim();
        if (lineToCompare === line) {
            found = true;
            break;
        }
    }

    assert(found, 'Could not find line: ' + line);
}

function assertHasContiguousLines(str, assertedLines) {
    var assertedLinesJoined = assertedLines.join('\n');

    var trimmedStr = str
        .split('\n')
        .map(function (line) {
            return line.trim();
        })
        .join('\n');

    var found = trimmedStr.indexOf(assertedLinesJoined) !== -1;

    assert(found, 'Could not find lines: \n' + assertedLinesJoined);
}

function assertDoesntHaveLine(str, line) {
    var lines = str.split('\n');
    var found = false;

    for (var i = 0; i < lines.length; i++) {
        if (lines[i].trim() === line) {
            found = true;
            break;
        }
    }

    assert(!found, 'Shouldn\'t have line: ' + line);
}

describe('Write', function () {
    it('write flags', function () {
        var input = fs.readFileSync(__dirname + '/fixtures/fuzzy.po', 'utf8');
        var po = PO.parse(input);
        var str = po.toString();
        assertHasLine(str, '#, fuzzy');
    });

    it('write empty comment without an unecessary space', function () {
        var input = fs.readFileSync(__dirname + '/fixtures/fuzzy.po', 'utf8');
        var po = PO.parse(input);
        var str = po.toString();
        assertHasLine(str, '#', true);
    });

    it('write flags only when true', function () {
        var input = fs.readFileSync(__dirname + '/fixtures/fuzzy.po', 'utf8');
        var po = PO.parse(input);

        // Flip flag
        po.items[0].flags.fuzzy = false;

        var str = po.toString();
        assertDoesntHaveLine(str, '#, fuzzy');
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
        assertHasLine(str, '#. extracted from test');
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

    describe('plurals', function () {
        describe('nplurals INTEGER', function () {
            it('should write 2 msgstrs when formatted correctly', function () {
                var input = fs.readFileSync(
                    __dirname + '/fixtures/plurals/messages.po', 'utf8'
                );
                var po = PO.parse(input);
                var str = po.toString();
                assertHasContiguousLines(str, [
                    'msgid_plural "{{$count}} things"',
                    'msgstr[0] ""',
                    'msgstr[1] ""'
                ]);
            });

            it('should write 2 msgstrs when formatted incorrectly', function () {
                var input = fs.readFileSync(
                    __dirname + '/fixtures/plurals/messages.po', 'utf8'
                );
                var po = PO.parse(input);
                var str = po.toString();
                assertHasContiguousLines(str, [
                    'msgid_plural "{{$count}} mistakes"',
                    'msgstr[0] ""',
                    'msgstr[1] ""'
                ]);
            });
        });

        describe('nplurals missing', function () {
            it('should write 2 msgstrs when formatted correctly with translation', function () {
                var input = fs.readFileSync(
                    __dirname + '/fixtures/plurals/nplurals-missing.po', 'utf8'
                );
                var po = PO.parse(input);
                var str = po.toString();
                assertHasContiguousLines(str, [
                    'msgid_plural "{{$count}} things"',
                    'msgstr[0] "1 thing"',
                    'msgstr[1] "{{$count}} things"'
                ]);
            });

            it('should write 2 msgstrs when formatted correctly with no translation', function () {
                var input = fs.readFileSync(
                    __dirname + '/fixtures/plurals/nplurals-missing.po', 'utf8'
                );
                var po = PO.parse(input);
                var str = po.toString();
                assertHasContiguousLines(str, [
                    'msgid_plural "{{$count}} other things"',
                    'msgstr[0] ""',
                    'msgstr[1] ""',
                ]);
            });

            it('should keep same number of msgstrs when formatted incorrectly with translation', function () {
                var input = fs.readFileSync(
                    __dirname + '/fixtures/plurals/nplurals-missing.po', 'utf8'
                );
                var po = PO.parse(input);
                var str = po.toString();
                assertHasContiguousLines(str, [
                    'msgid_plural "{{$count}} mistakes"',
                    'msgstr[0] "1 mistake"',
                    '',
                    '# incorrect plurals, with no translation'
                ]);
            });

            it('should write 2 msgstrs when formatted incorrectly with no translation', function () {
                var input = fs.readFileSync(
                    __dirname + '/fixtures/plurals/nplurals-missing.po', 'utf8'
                );
                var po = PO.parse(input);
                var str = po.toString();
                assertHasContiguousLines(str, [
                    'msgid_plural "{{$count}} other mistakes"',
                    'msgstr[0] ""',
                    'msgstr[1] ""'
                ]);
            });
        });

        describe('nplurals=1', function () {
            it('should write 1 msgstr when formatted correctly with translation', function () {
                var input = fs.readFileSync(
                    __dirname + '/fixtures/plurals/nplurals-1.po', 'utf8'
                );
                var po = PO.parse(input);
                var str = po.toString();
                assertHasContiguousLines(str, [
                    'msgid_plural "{{$count}} things"',
                    'msgstr[0] "{{$count}} thing"'
                ]);
            });

            it('should write 1 msgstr when formatted correctly with no translation', function () {
                var input = fs.readFileSync(
                    __dirname + '/fixtures/plurals/nplurals-1.po', 'utf8'
                );
                var po = PO.parse(input);
                var str = po.toString();
                assertHasContiguousLines(str, [
                    'msgid_plural "{{$count}} other things"',
                    'msgstr[0] ""',
                    '',
                    '# incorrect plurals, with translation'
                ]);
            });

            it('should keep same number of msgstrs when formatted incorrectly with translation', function () {
                var input = fs.readFileSync(
                    __dirname + '/fixtures/plurals/nplurals-1.po', 'utf8'
                );
                var po = PO.parse(input);
                var str = po.toString();
                assertHasContiguousLines(str, [
                    'msgid_plural "{{$count}} mistakes"',
                    'msgstr[0] "1 mistake"',
                    'msgstr[1] "{{$count}} mistakes"'
                ]);
            });

            it('should write 1 msgstr when formatted incorrectly with no translation', function () {
                var input = fs.readFileSync(
                    __dirname + '/fixtures/plurals/nplurals-1.po', 'utf8'
                );
                var po = PO.parse(input);
                var str = po.toString();
                assertHasContiguousLines(str, [
                    'msgid_plural "{{$count}} other mistakes"',
                    'msgstr[0] ""'
                ]);
            });
        });

        describe('nplurals=2', function () {
            it('should write 2 msgstrs when formatted correctly with translation', function () {
                var input = fs.readFileSync(
                    __dirname + '/fixtures/plurals/nplurals-2.po', 'utf8'
                );
                var po = PO.parse(input);
                var str = po.toString();
                assertHasContiguousLines(str, [
                    'msgid_plural "{{$count}} things"',
                    'msgstr[0] "1 thing"',
                    'msgstr[1] "{{$count}} things"'
                ]);
            });

            it('should write 2 msgstrs when formatted correctly with no translation', function () {
                var input = fs.readFileSync(
                    __dirname + '/fixtures/plurals/nplurals-2.po', 'utf8'
                );
                var po = PO.parse(input);
                var str = po.toString();
                assertHasContiguousLines(str, [
                    'msgid_plural "{{$count}} other things"',
                    'msgstr[0] ""',
                    'msgstr[1] ""',
                ]);
            });

            it('should keep same number of msgstrs when formatted incorrectly with translation', function () {
                var input = fs.readFileSync(
                    __dirname + '/fixtures/plurals/nplurals-2.po', 'utf8'
                );
                var po = PO.parse(input);
                var str = po.toString();
                assertHasContiguousLines(str, [
                    'msgid_plural "{{$count}} mistakes"',
                    'msgstr[0] "1 mistake"',
                    '',
                    '# incorrect plurals, with no translation'
                ]);
            });

            it('should write 2 msgstrs when formatted incorrectly with no translation', function () {
                var input = fs.readFileSync(
                    __dirname + '/fixtures/plurals/nplurals-2.po', 'utf8'
                );
                var po = PO.parse(input);
                var str = po.toString();
                assertHasContiguousLines(str, [
                    'msgid_plural "{{$count}} other mistakes"',
                    'msgstr[0] ""',
                    'msgstr[1] ""'
                ]);
            });
        });

        describe('nplurals=3', function () {
            it('should write 3 msgstrs when formatted correctly with translation', function () {
                var input = fs.readFileSync(
                    __dirname + '/fixtures/plurals/nplurals-3.po', 'utf8'
                );
                var po = PO.parse(input);
                var str = po.toString();
                assertHasContiguousLines(str, [
                    'msgid_plural "{{$count}} things"',
                    'msgstr[0] "1 thing"',
                    'msgstr[1] "{{$count}} things"',
                    'msgstr[2] "{{$count}} things"'
                ]);
            });

            it('should write 3 msgstrs when formatted correctly with no translation', function () {
                var input = fs.readFileSync(
                    __dirname + '/fixtures/plurals/nplurals-3.po', 'utf8'
                );
                var po = PO.parse(input);
                var str = po.toString();
                assertHasContiguousLines(str, [
                    'msgid_plural "{{$count}} other things"',
                    'msgstr[0] ""',
                    'msgstr[1] ""',
                    'msgstr[2] ""'
                ]);
            });

            it('should keep same number of msgstrs when formatted incorrectly with translation', function () {
                var input = fs.readFileSync(
                    __dirname + '/fixtures/plurals/nplurals-3.po', 'utf8'
                );
                var po = PO.parse(input);
                var str = po.toString();
                assertHasContiguousLines(str, [
                    'msgid_plural "{{$count}} mistakes"',
                    'msgstr[0] "1 mistake"',
                    'msgstr[1] "{{$count}} mistakes"',
                    '',
                    '# incorrect plurals, with no translation'
                ]);
            });

            it('should write 3 msgstrs when formatted incorrectly with no translation', function () {
                var input = fs.readFileSync(
                    __dirname + '/fixtures/plurals/nplurals-3.po', 'utf8'
                );
                var po = PO.parse(input);
                var str = po.toString();
                assertHasContiguousLines(str, [
                    'msgid_plural "{{$count}} other mistakes"',
                    'msgstr[0] ""',
                    'msgstr[1] ""',
                    'msgstr[2] ""'
                ]);
            });
        });

        describe('nplurals=6', function () {
            it('should write 6 msgstrs when formatted correctly with translation', function () {
                var input = fs.readFileSync(
                    __dirname + '/fixtures/plurals/nplurals-6.po', 'utf8'
                );
                var po = PO.parse(input);
                var str = po.toString();
                assertHasContiguousLines(str, [
                    'msgid_plural "{{$count}} things"',
                    'msgstr[0] "1 thing"',
                    'msgstr[1] "{{$count}} things"',
                    'msgstr[2] "{{$count}} things"',
                    'msgstr[3] "{{$count}} things"',
                    'msgstr[4] "{{$count}} things"',
                    'msgstr[5] "{{$count}} things"'
                ]);
            });

            it('should write 6 msgstrs when formatted correctly with no translation', function () {
                var input = fs.readFileSync(
                    __dirname + '/fixtures/plurals/nplurals-6.po', 'utf8'
                );
                var po = PO.parse(input);
                var str = po.toString();
                assertHasContiguousLines(str, [
                    'msgid_plural "{{$count}} other things"',
                    'msgstr[0] ""',
                    'msgstr[1] ""',
                    'msgstr[2] ""',
                    'msgstr[3] ""',
                    'msgstr[4] ""',
                    'msgstr[5] ""'
                ]);
            });

            it('should keep same number of msgstrs when formatted incorrectly with translation', function () {
                var input = fs.readFileSync(
                    __dirname + '/fixtures/plurals/nplurals-6.po', 'utf8'
                );
                var po = PO.parse(input);
                var str = po.toString();
                assertHasContiguousLines(str, [
                    'msgid_plural "{{$count}} mistakes"',
                    'msgstr[0] "1 mistake"',
                    'msgstr[1] "{{$count}} mistakes"',
                    'msgstr[2] "{{$count}} mistakes"',
                    '',
                    '# incorrect plurals, with no translation'
                ]);
            });

            it('should write 6 msgstrs when formatted incorrectly with no translation', function () {
                var input = fs.readFileSync(
                    __dirname + '/fixtures/plurals/nplurals-6.po', 'utf8'
                );
                var po = PO.parse(input);
                var str = po.toString();
                assertHasContiguousLines(str, [
                    'msgid_plural "{{$count}} other mistakes"',
                    'msgstr[0] ""',
                    'msgstr[1] ""',
                    'msgstr[2] ""',
                    'msgstr[3] ""',
                    'msgstr[4] ""',
                    'msgstr[5] ""'
                ]);
            });
        });
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
            assertHasLine(item.toString(), '"\\n"');
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

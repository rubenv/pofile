var PO = require('../lib/po.js')
  , fs = require('fs')
  , assert = require('assert')

PO.load('text.po', function(po) {
  assert.equal(po.headers['Plural-Forms'], 'nplurals=2; plural=(n!=1);', 'Parsed "Plural-Forms" header.');
  assert.equal(po.items.length, 67, 'Successfully parsed 67 items.');
  var item = po.items.pop();
  assert.equal(item.comments.length, 1, 'Parsed item comment.');
  po.save('copy.po');
});


var po = require('../lib/po.js')
  , fs = require('fs')
  , assert = require('assert')
  , exec = require('child_process').exec;
  
po.load('text.po', function(_po){
  _po.save('copy.po', function(){
    var orig = fs.readFileSync('text.po');
    var data = fs.readFileSync('copy.po');
    
    console.log(data == orig);
    assert.equal(orig, data, 'Saved data is identical to original.');
  });
});
  
var fs = require('fs');

var PO = function() {
  this.headers = {};
  this.items = [];
};

PO.prototype.write = function(filename) {
  
};

PO.load = function(filename, callback) {
  fs.readFile(filename, 'utf-8', function(err, data){
    if (err) throw err;
    var po = new PO
      , parts = data.split(/\n\n/)
      , headers = parts.shift().split(/\n/);
    
    headers.forEach(function(header){
      if (header.match(/^"/)) {
        var p = header.split(/:/, 2);
        po.headers[p[0].trim()] = p[1].trim();
      }
    });
    
    parts.forEach(function(part){
      var item = PO.Item.parse(part);
      po.items.push(item);
    });
    
    callback(po);
  });
};

PO.Item = function() {
  this.msgid = null;
  this.references = [];
  this.msgid_plural = null;
  this.msgstr = [];
};

PO.Item.parse = function(chunk) {
  
  var item = new PO.Item();
  var parts = chunk.split(/\nmsg/);
  
  var extract = function(string) {
    var lines = string.split(/\n/);
    var value = '';
    lines.forEach(function(line){
      var p = line.split(/"/); p.shift(); p.pop();
      value += "\n" + p.join('"');
    });
    return value.trim();
  };
  
  parts.forEach(function(part){
    if (part.match(/^#:/)) {
      item.references.push(part.replace(/^#:\s/, ''));
    }
    else if (part.match(/^id\s/)) {
      item.msgid = extract(part);
    }
    else if (part.match(/id_plural/)) {
      item.msgid_plural = extract(part);
    }
    else if (part.match(/str/)) {
      item.msgstr.push(extract(part));
    }
  });

  return item;
};

PO.load('extras.po', function(po){
  //console.log(po);
});
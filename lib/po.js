var fs = require('fs')
  , util = require('util');

var PO = function() {
  this.headers = {};
  this.items = [];
};

PO.prototype.save = function(filename, callback) {
  var lines = ['msgid ""', 'msgstr ""']
    , that = this;

  var keys = Object.keys(this.headers);
  keys.forEach(function(key){
    lines.push(util.format('"%s: %s\\n"', key, that.headers[key]));
  });
  
  lines.push('');
  
  this.items.forEach(function(item){
    lines.push(item.toString());
    lines.push('');
  });
  
  fs.writeFile(filename, lines.join("\n"), function(err){
    if (err) throw err;
    callback && callback();
  })
};

PO.load = function(filename, callback) {
  fs.readFile(filename, 'utf-8', function(err, data){
    if (err) throw err;
    var po = new PO
      , parts = data.split(/\n\n/)
      , headers = parts.shift().split(/\n/);
    
    headers.forEach(function(header){
      if (header.match(/^"/)) {
        header = header.trim().replace(/^"/, '').replace(/\\n"$/, '');        
        var p = header.split(/:/)
          , name = p.shift().trim()
          , value = p.join(':').trim().replace(/n$/);
        po.headers[name] = value;
      }
    });
        
    parts.forEach(function(part){
      if (part.length < 1) return;
      var item = PO.Item.parse(part);
      po.items.push(item.toString());
    });
    
    callback && callback(po);
  });
};

PO.Item = function() {
  this.msgid = null;
  this.references = [];
  this.msgid_plural = null;
  this.msgstr = [];
};

PO.Item.prototype.toString = function() {
  var lines = []
    , that = this;
  
  var _processEach = function(keyword, text, i) {
    var lines = []
      , parts = text.split(/\n/)
      , index = typeof i != 'undefined' ? util.format('[%d]', i) : '';
    if (parts.length > 1) {
      lines.push(util.format('%s%s ""', keyword, index));
      parts.forEach(function(part){
        lines.push(util.format('"%s"', part))
      });
    }
    else {
      lines.push(util.format('%s%s "%s"', keyword, index, text));
    }
    return lines;
  }
  
  if (this.references.length > 0) {
    this.references.forEach(function(ref){
      lines.push(util.format('#: %s', ref));
    });
    ['msgid', 'msgid_plural', 'msgstr'].forEach(function(keyword){
      var text = that[keyword];
      if (text != null) {
        if (util.isArray(text) && text.length > 1) {
          text.forEach(function(t, i){
            lines = lines.concat(_processEach(keyword, t, i));
          });
        }
        else {
          text = util.isArray(text) ? text.join() : text;
          lines = lines.concat(_processEach(keyword, text));
        }
      }
    });
  };
  
  return lines.join("\n");
};

PO.Item.parse = function(chunk) {
  
  var item = new PO.Item();
  var parts = chunk.split(/\nmsg/);
  
  var _extract = function(string) {
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
      item.msgid = _extract(part);
    }
    else if (part.match(/id_plural/)) {
      item.msgid_plural = _extract(part);
    }
    else if (part.match(/str/)) {
      item.msgstr.push(_extract(part));
    }
  });

  return item;
};

module.exports = PO;
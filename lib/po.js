var fs = require('fs')
  , util = require('util');

function trim(string) {
  return string.replace(/^\s+|\s+$/g, '');
};

var PO = function() {
  this.comments = [];
  this.headers = {};
  this.items = [];
};

PO.prototype.save = function(filename, callback) {
  fs.writeFile(filename, this.toString(), function(err) {
    if (err) throw err;
    callback && callback();
  });
};

PO.prototype.toString = function() {
  var lines = []
    , that = this;

  if (this.comments) {
    this.comments.forEach(function(comment) {
      lines.push('# ' + comment);
    });
  }

  lines.push('msgid ""');
  lines.push('msgstr ""');

  var keys = Object.keys(this.headers);
  keys.forEach(function(key) {
    lines.push(util.format('"%s: %s\\n"', key, that.headers[key]));
  });

  lines.push('');

  this.items.forEach(function(item) {
    lines.push(item.toString());
    lines.push('');
  });

  return lines.join("\n");
};

PO.load = function(filename, callback) {
  fs.readFile(filename, 'utf-8', function(err, data) {
    if (err) throw err;
    var po = PO.parse(data);
    callback && callback(po);
  });
};

PO.parse = function(data) {
    var po = new PO
    , sections = data.split(/\n\n/)
    , headers = sections.shift()
    , lines = sections.join("\n").split(/\n/);

  po.headers = {
    'Project-Id-Version': '',
    'Report-Msgid-Bugs-To': '',
    'POT-Creation-Date': '',
    'PO-Revision-Date': '',
    'Last-Translator': '',
    'Language': '',
    'Language-Team': '',
    'Content-Type': '',
    'Content-Transfer-Encoding': '',
    'Plural-Forms': '',
  };

  headers.split(/\n/).forEach(function(header) {
    if (header.match(/^#/)) {
      po.comments.push(header.replace(/^#\s*/, ''));
    }
    if (header.match(/^"/)) {
      header = header.trim().replace(/^"/, '').replace(/\\n"$/, '');
      var p = header.split(/:/)
        , name = p.shift().trim()
        , value = p.join(':').trim().replace(/n$/);
      po.headers[name] = value;
    }
  });

  var item = new PO.Item()
    , context = null
    , plural = 0;

  function finish() {
    if (item.msgid.length > 0) {
      po.items.push(item);
      item = new PO.Item();
    }
  };

  function extract(string) {
    string = trim(string);
    string = string.replace(/^[^"]*"|"$/g, '');
    string = string.replace(/\\"/g, '"');
    string = string.replace(/\\\\/g, '\\');
    return string;
  };

  while (lines.length > 0) {
    var line = trim(lines.shift())
      , add = false;
    if (line.match(/^#:/)) { // Reference
      finish();
      item.references.push(trim(line.replace(/^#:/, '')));
    }
    else if (line.match(/^#/)) { // Comment
      finish();
      item.comments.push(trim(line.replace(/^#/, '')));
    }
    else if (line.match(/^msgid_plural/)) { // Plural form
      item.msgid_plural = extract(line);
      context = 'msgid_plural';
    }
    else if (line.match(/^msgid/)) { // Original
      finish();
      item.msgid = extract(line);
      context = 'msgid';
    }
    else if (line.match(/^msgstr/)) { // Translation
      var m = line.match(/^msgstr\[(\d+)\]/);
      plural = m && m[1] ? parseInt(m[1]) : 0;
      item.msgstr[plural] = extract(line);
      context = 'msgstr'
    }
    else { // Probably multiline string or blank
      if (line.length > 0) {
        if (context == 'msgstr') {
          item.msgstr[plural] += extract(line);
        }
        else if (context == 'msgid') {
          item.msgid += extract(line);
        }
        else if (context == 'msgid_plural') {
          item.msgid_plural += extract(line);
        }
      }
    }
  };
  finish();

  return po;
};

PO.Item = function() {
  this.msgid = '';
  this.references = [];
  this.msgid_plural = null;
  this.msgstr = [];
  this.comments = [];
};

PO.Item.prototype.toString = function() {
  var lines = []
    , that = this;

  var _process = function(keyword, text, i) {
    var lines = []
      , parts = text.split(/\n/)
      , index = typeof i != 'undefined' ? util.format('[%d]', i) : '';
    if (parts.length > 1) {
      lines.push(util.format('%s%s ""', keyword, index));
      parts.forEach(function(part) {
        lines.push(util.format('"%s"', part))
      });
    }
    else {
      lines.push(util.format('%s%s "%s"', keyword, index, text));
    }
    return lines;
  }

  if (this.references.length > 0) {
    this.references.forEach(function(ref) {
      lines.push(util.format('#: %s', ref));
    });
  };

  ['msgid', 'msgid_plural', 'msgstr'].forEach(function(keyword) {
    var text = that[keyword];
    if (text != null) {
      if (util.isArray(text) && text.length > 1) {
        text.forEach(function(t, i) {
          lines = lines.concat(_process(keyword, t, i));
        });
      }
      else {
        text = util.isArray(text) ? text.join() : text;
        lines = lines.concat(_process(keyword, text));
      }
    }
  });

  return lines.join("\n");
};

module.exports = PO;
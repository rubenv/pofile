# pofile - gettext .po parsing for JavaScript

> Parse and serialize Gettext PO files.

[![Build Status](https://travis-ci.org/rubenv/pofile.png?branch=master)](https://travis-ci.org/rubenv/pofile)

## Usage

```js
var PO = require('pofile');

PO.load('text.po', function (err, po) {
    // Handle err if needed
    console.log(po.headers);
    console.log(po.items);
  
    po.save('copy.po', function (err) {
        // Handle err if needed
        console.log('We copied a PO file for no reason!');
    });
});
```

## Credits

  Originally based on node-po (written by Michael Holly). Rebranded because
  node-po is unmaintained and because this library is no longer limited to
  Node.JS: it works in the browser too.

  Changes compared to node-po:

  * Proper handling of async methods that won't crash your Node.JS process when
    something goes wrong.
  * Support for parsing string flags (e.g. fuzzy).
  * A test suite.
  * Browser support (through Browserified and bower).

## License 

    (The MIT License)

    Copyright (C) 2013 by Ruben Vermeersch <ruben@savanne.be>
    Copyright (C) 2012 by Michael Holly

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.

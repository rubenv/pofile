Used to load and save PO files.

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

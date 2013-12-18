Used to load and save PO files.

```js
var PO = require('node-po');

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

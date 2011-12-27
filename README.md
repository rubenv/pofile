Used to load and save PO files.

    var po = require('po')  
      , fs = require('fs')
    
    po.load('text.po', function(_po){
      console.log(_po.headers);
      console.log(_po.items);
      
      _po.save('copy.po', function(){
        console.log('We copied a PO file for no reason!');
      });
    });
    
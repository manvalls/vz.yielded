# vz Yielded

[![NPM](https://nodei.co/npm/vz.yielded.png?downloads=true)](https://nodei.co/npm/vz.yielded/)

No piece of software is ever completed, feel free to contribute and be humble

## Sample usage:

```javascript

var Yielded = require('vz.yielded'),
    foo = new Yielded();

foo.on('done',function(){
  if(this.error) throw this.error;
  else console.log('Got ',this.value);
});

foo.value = 'bar'; // Got bar

```



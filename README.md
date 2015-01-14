# vz Yielded

**DEPRECATED in favour of [y-resolver](https://www.npmjs.org/package/y-resolver "y-resolver")**

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



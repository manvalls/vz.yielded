[![NPM](https://nodei.co/npm/vz.yielded.png?downloads=true)](https://nodei.co/npm/vz.yielded/)

This package uses or may use at some point in the future ECMAScript 6 features. Use it on a compatible environment or transpile it with Traceur, Closure Compiler, es6-transpiler or equivalent. Please note that some of these have flaws and bugs, test your code carefully until you find a suitable tool for your task.

When cloning this repository, put the folder inside another named "node_modules" in order to avoid potential errors related to npm's dependency handling, and then run `npm install` on it.

No piece of software is ever completed, feel free to contribute and be humble.

# vz Yielded

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




var Machine = require('vz.machine'),
    Property = require('vz.property'),
    constants = require('vz.constants'),
    resolved = new Property(),
    error = new Property(),
    value = new Property(),
    Yielded;

Yielded = module.exports = function(){
  Machine.call(this);
  resolved.set(this,false);
};

Yielded.prototype = new Machine(true);
Yielded.prototype.constructor = Yielded;

Object.defineProperties(Yielded.prototype,{
  value: {
    get: function(){
      return value.get(this);
    },
    set: function(v){
      if(this.done) return;
      resolved.set(this,true);
      value.set(this,v);
      this.fire('done').resolve();
    }
  },
  error: {
    get: function(){
      return error.get(this);
    },
    set: function(e){
      if(this.done) return;
      resolved.set(this,true);
      error.set(this,e);
      this.fire('done').resolve();
    }
  },
  done: {
    get: function(){
      return resolved.get(this);
    },
    set: constants.NOOP
  }
});



var Machine = require('vz.machine'),
    Property = require('vz.property'),
    constants = require('vz.constants'),
    Promise = global.Promise,
    resolved = new Property(),
    error = new Property(),
    value = new Property(),
    Yielded;

Yielded = module.exports = function(){
  Machine.call(this);
  resolved.set(this,false);
  
  if(arguments.length == 1){
    if(arguments[0] instanceof Error) this.error = arguments[0];
    else this.value = arguments[0];
  }
};

Yielded.get = function(yd){
  var p;
  
  if(!yd) return new Yielded(yd);
  if(yd.isYielded) return yd;
  
  if(typeof yd.then == 'function'){
    p = yd;
    yd = new Yielded();
    p.then(function(v){yd.value = v;},function(e){yd.error = e;});
    return yd;
  }
  
  if(typeof yd == 'function'){
    p = yd;
    yd = new Yielded();
    
    p(function(e,v){
      if(e) yd.error = e;
      else yd.value = v;
    });
    
    return yd;
  }
  
  return new Yielded(yd);
}

Yielded.debug = false;

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
      this.fire('done');
    }
  },
  error: {
    get: function(){
      return error.get(this);
    },
    set: function(e){
      if(this.done) return;
      if(Yielded.debug) console.error(e.stack?e.stack:e);
      resolved.set(this,true);
      error.set(this,e);
      this.fire('done');
    }
  },
  done: {
    get: function(){
      return resolved.get(this);
    },
    set: constants.NOOP
  },
  
  isYielded: {
    value: true
  },
  toThunk: {value: function(){
    var that = this;
    return function(cb){
      function end(){
        if(that.error) cb(that.error);
        else cb(null,that.value);
      }
      
      if(that.done) end();
      else that.on('done',end);
    };
  }},
  toPromise: {value: function(){
    var that;
    
    if(!Promise) throw new Error('Promises not implemented on the current engine');
    if(this.done){
      if(this.error) return Promise.reject(this.error);
      else return Promise.accept(this.value);
    }
    
    that = this;
    return new Promise(function(resolve,reject){
      
      function end(){
        if(that.error) reject(that.error);
        else resolve(that.value);
      }
      
      if(that.done) end();
      else that.on('done',end);
      
    });
  }}
});



var Vse = require('vse'),
    Su = require('vz.rand').Su,
    Promise = global.Promise,
    
    consumed = Su(),
    resolved = Su(),
    error = Su(),
    value = Su(),
    
    index = Su(),
    awaiting = Su(),
    yieldeds = Su(),
    yielded = Su(),
    result = Su(),
    
    Yielded;

Yielded = module.exports = function Yielded(){
  Vse.call(this);
  this[resolved] = false;
  this[consumed] = false;
  
  if(arguments.length == 1){
    if(arguments[0] instanceof Error) this.error = arguments[0];
    else this.value = arguments[0];
  }
};

function onDone(){
  if(this.error) this[yielded].error = this.error;
  else this[yielded][result][this[index]] = this.value;
  
  if(--this[yielded][awaiting] <= 0) this[yielded].value = this[yielded][result];
}

function onConsumed(){
  var i;
  
  for(i = 0;i < this[yieldeds].length;i++) this[yieldeds][i].consumed = true;
}

Yielded.get = function(yd){
  var p,i;
  
  if(!yd) return new Yielded(yd);
  if(yd.isYielded) return yd;
  
  if(yd.constructor == Array){
    p = yd;
    
    yd = new Yielded();
    yd[awaiting] = 0;
    yd[yieldeds] = p;
    yd[result] = [];
    
    for(i = 0;i < p.length;i++){
      p[i] = Yielded.get(p[i]);
      p[i][yielded] = yd;
      p[i][index] = i;
      
      if(p[i].done){
        if(p[i].error) yd.error = p[i].error;
        else yd[result][i] = p[i].value;
      }else{
        yd[awaiting]++;
        p[i].on('done',onDone);
      }
    }
    
    if(!yd[awaiting]) yd.value = yd[result];
    
    return yd;
  }
  
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

if(global.process) Yielded.debug = 'yddb' in process.env;
else Yielded.debug = false;

Yielded.prototype = new Vse();
Yielded.prototype.constructor = Yielded;

Object.defineProperties(Yielded.prototype,{
  value: {
    get: function(){
      return this[value];
    },
    set: function(v){
      if(this.done) return;
      
      this[resolved] = true;
      this[value] = v;
      
      this.fire('done');
    }
  },
  error: {
    get: function(){
      return this[error];
    },
    set: function(e){
      if(this.done) return;
      if(Yielded.debug) console.error(e.stack?e.stack:e);
      
      this[resolved] = true;
      this[error] = e;
      
      this.fire('done');
    }
  },
  done: {
    get: function(){
      return this[resolved];
    },
    set: function(data){
      if(data === true && !this.done){
        this[resolved] = true;
        this.fire('done');
      }
    }
  },
  consumed: {
    get: function(){
      return this[consumed];
    },
    set: function(value){
      if(!value) return;
      if(!this.done) throw new Error('You can\'t consume a yielded not yet done');
      this[consumed] = true;
      this.fire('consumed');
    }
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


var CSJS = require('./csjs');

var block = {};

for(var i = 0; i < 5000; i++) {
  block[i] = {
    color: 'blue',
    div: {color: 'red'},
    ul: {
      li: {
        span: {border: '1px solid #aaa'}
      }
    }
  };
}

function timer(func) {
  var start = new Date();
  func();
  return new Date() - start;
}

CSJS.minify = true;

console.log(timer(function() {
  CSJS.compile(block);
}));

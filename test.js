var CSJS = require('./csjs');

var block = {};

for(var i = 0; i < 100; i++) {
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
  for(var i = 0; i < 50; i++) {
    func();
  }

  return new Date() - start;
}

CSJS.minify = true;

console.log(timer(function() {
  var css = CSJS.compile(block);
  // console.log(css.length);
}));

// one style sheet of 5,000 blocks
// 350,000+ chars minified (launchpad is about 100k)
// 384 ms to compile
// 25% more chars un-minified

// when split into 50 stylesheets of 100 blocks
// 84 ms to compile

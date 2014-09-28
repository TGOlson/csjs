
// allow script to work in browser or node
// CSJS should already be loaded if used in browser
if(typeof exports === 'object') {
  var CSJS = require('./csjs');
}


// toggle minification
CSJS.minify = true;


/*
 * Test fixtures
 */

// default test block
// includes 4 levels of nesting and 5 unique styles
var defaultBlock = {
  color: 'blue',
  padding: '5px',
  div: {color: 'red'},
  ul: {
    li: {
      span: {
        border: '1px solid #aaa',
        color: 'blue'
      }
    }
  }
};


/*
 * Test helpers
 */

var iterations = 10;

function timer(func) {
  var start = new Date(),
    duration;

  for(var i = 0; i < iterations; i++) {
    func();
  }

  duration = new Date() - start;

  console.log('Duration:', duration + 'ms');
  return duration;
}


var blockCount = 100;

// stats at 5000 blocks:
// 490,000+ chars minified (launchpad is about 100k)
// 30% more chars un-minified
function makeBlocks() {
  var blocks = {};

  for(var i = 0; i < blockCount; i++) {
    blocks[i] = defaultBlock;
  }

  return blocks;
}


/*
 * Test functions
 */

// raw compilation
// this should never be done for real-time client style updates
// probably only use this as server-side processing
function testLiveCompilation() {
  var blocks = makeBlocks();

  console.log('Live compiling', iterations, 'sets of', blockCount, 'style blocks.');

  timer(function() {
    var css = CSJS.compile(blocks);
    // console.log('Chars compiled:', css.length);
  });
}

// raw compilation without pre-processing
// this can only be done if styles are defined without nested syntax
function testLiveCompilationNp() {
  var blocks = makeBlocks();

  console.log('Live compiling without pre-processing', iterations, 'sets of', blockCount, 'style blocks.');

  timer(function() {
    var css = CSJS.compile(blocks, true);
    // console.log('Chars compiled:', css.length);
  });
}

// style-sheet initialization/compilation
// tests compiling a style-sheet from scratch
function testStyleSheetInit() {
  var blocks = makeBlocks();

  console.log('Initializing', iterations, 'style-sheets with', blockCount, 'style blocks each.');

  timer(function() {
    new CSJS.StyleSheet(blocks);
  });
}


// style-sheet recompilation
// tests recompiling a style-sheet that is already initialized
function testStyleSheetRecompile() {
  var blocks = makeBlocks(),
    styleSheet = new CSJS.StyleSheet(blocks);

  console.log('Re-compiling', iterations, 'style-sheets with', blockCount, 'style blocks each.');

  timer(function() {
    styleSheet.compile();
  });
}


/*
 * Run tests
 */

testLiveCompilation();
// 290ms to compile
// minification doesn't seem to make difference
// when split into 50 style-sheets of 100 blocks ~ 100ms to compile

testLiveCompilationNp();
// 19ms to compile
// without pre-processing


testStyleSheetInit();
// 450ms to init/compile

testStyleSheetRecompile();
// 160ms to recompile


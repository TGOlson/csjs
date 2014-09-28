// allow script to work in browser or node
// CSJS should already be loaded if used in browser
if(typeof exports === 'object') {
  var CSJS = require('../csjs');
}


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

// these get set when tests run
var iterations;

function timer(func) {
  console.time('Duration', 'ms');

  for(var i = 0; i < iterations; i++) {
    func();
  }

  console.timeEnd('Duration', 'ms');
}

// stats at 5000 blocks:
// 490,000+ chars minified (launchpad is about 100k)
// 30% more chars un-minified
function makeBlocks(blockCount) {
  var blocks = {};

  for(var i = 0; i < blockCount; i++) {
    blocks[i] = defaultBlock;
  }

  return blocks;
}

function profile(functions, testCycles) {
  var cycle,
    blockCount,
    blocks,
    func;

  for(var i = 0; i < testCycles.length; i++) {
    cycle = testCycles[i];
    iterations = cycle.iterations;
    blockCount = cycle.blockCount;

    blocks = makeBlocks(blockCount);

    for(var j = 0; j < functions.length; j++) {
      func = functions[j];
      var fCall = func(blocks, iterations, blockCount);
      timer(fCall);
    }
  }
}


/*
 * Test functions
 */

// raw compilation
// this should never be done for real-time client style updates
// probably only use this as server-side processing
function liveCompilation(blocks, iterations, blockCount) {
  console.log('Live compiling', iterations, 'sets of', blockCount, 'style blocks.');

  return CSJS.compile.bind(CSJS, blocks);
}

// raw compilation without pre-processing
// this can only be done if styles are defined without nested syntax
function liveCompilationNoPreprocess(blocks, iterations, blockCount) {
  console.log('Live compiling without pre-processing', iterations, 'sets of', blockCount, 'style blocks.');

  return CSJS.compile.bind(CSJS, blocks, true);
}

// style-sheet initialization/compilation
// tests compiling a style-sheet from scratch
function styleSheetInit(blocks, iterations, blockCount) {
  console.log('Initializing', iterations, 'style-sheets with', blockCount, 'style blocks each.');

  return function() {
    return new CSJS.StyleSheet(blocks);
  };
}


// style-sheet recompilation
// tests recompiling a style-sheet that is already initialized
function styleSheetRecompile(blocks, iterations, blockCount) {
  var styleSheet = new CSJS.StyleSheet(blocks);

  console.log('Recompiling', iterations, 'style-sheets with', blockCount, 'style blocks each.');

  return styleSheet.compile.bind(styleSheet);
}


/*
 * Test settings
 */

CSJS.minify = true;

var testCycles = [
  // {
  //   iterations: 1,
  //   blockCount: 5000
  // },
  // {
  //   iterations: 10,
  //   blockCount: 500
  // },
  {
    iterations: 50,
    blockCount: 100
  },
  {
    iterations: 1,
    blockCount: 1000
  }
];

var functions = [
  liveCompilation,
  // liveCompilationNoPreprocess,
  styleSheetInit,
  styleSheetRecompile
];

/*
 * Run tests
 */

profile(functions, testCycles);

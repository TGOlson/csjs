(function(definition) {

  // require/node
  if(typeof exports === 'object') {
    module.exports = definition();

  // <script>
  } else {

    // globally define One
    CSJS = definition();
  }


})(function() {
'use strict';

/**
 * Public API Object
 * Contains core functions and properties
 */
function CSJS() {}



/**
 * Constructs a style-sheet which contains a direct reference of all styles
 * coerces promises from different systems.
 * @param {object} styleObject - styles declaration blocks to instantiate style-sheet with
 */
CSJS.StyleSheet = StyleSheet;
function StyleSheet(declarationBlocks, id) {}


/**
 * Constructs a style objects which contains declarations
 * @param {string} selector - style selector
 * @param {object} declarationBlock - style declaration block
 */
CSJS.Style = Style;
function Style(selector, declarationBlock) {}


/**
 * Constructs a compiler engine
 */
CSJS.Compiler = Compiler;
function Compiler() {}

// compiles a javascript object in compatible format to native css
Compiler.jsToCSS =  jsToCSS;
function jsToCSS(blocks, level) {
  var css = [],
    selector,
    block,
    cssBlock;

  for(selector in blocks) {
    block = blocks[selector];

    // invoke any functional declarations, passing in the selector
    // TODO: is there something better to pass in?
    if(typeof block === 'function') {
      block = block(selector);
    }

    cssBlock = compileBlock(selector, block, level);

    css.push(cssBlock);
  }

  return css.join('\n');
}

CSJS.Util = Util;
function Util() {}

// delimter for various mapping util
Util.delimiter = ' ';

/*
 * Flattens an object
 * @param {object} object - object to flatten
 * @param {boolean} shallow - if true object is only flattened one level
 * @return {object} - flattened object
 */
Util.flatten = flatten;
function flatten(object, shallow) {
  var flattened = {},
    property,
    value,
    nextLevel,
    prefix;

  for(property in object) {
    value = object[property];

    if(typeof value === 'object' && shallow !== null && value !== null) {

      // if shallow is required, set shallow to stopping keyword null
      if(shallow) shallow = null;

      nextLevel = flatten(value, shallow);
      prefix = property + Util.delimiter;

      Util.merge(flattened, nextLevel, prefix);

    } else {
      flattened[property] = value;
    }
  }

  return flattened;
}

/*
 * Destructively merges source data to an object
 * @param {object} object - object to merge data into
 * @param {object} source - object of source data
 * @param {string} prefix - [optional] prefix properties with value
 * @return {object} merged object
 */
Util.merge = merge;
function merge(object, source, prefix) {
  var merged = {},
    property,
    value;

  prefix = prefix || '';

  for(property in source) {
    value = source[property];

    object[prefix + property] = value;
  }

  return object;
}


return CSJS;
});

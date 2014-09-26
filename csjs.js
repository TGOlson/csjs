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
function jsToCSS(blocks) {
  var css = [],
    selector,
    block,
    cssBlock;

  blocks = preProcess(blocks);

  for(selector in blocks) {
    block = blocks[selector];

    // invoke any functional declarations, passing in the selector
    // TODO: is there something better to pass in?
    if(typeof block === 'function') {
      block = block(selector);
    }

    cssBlock = Compiler.compileBlock(selector, block);

    css.push(cssBlock);
  }

  return css.join('\n');
}

// pre-processor for css compilation
// flattens a java-script object
// thens un-flattens one level from the bottom
function preProcess(blocks) {
  var processed = flatten(blocks);
  return unflatten(processed);
}

Compiler.compileBlock = compileBlock;
function compileBlock(selector, block) {
  var css = selector + ' {\n',
    property,
    value;

  for(property in block) {
    value = block[property];

    css += '  ' + property + ': ' + value + ';\n';
  }

  return css + '}';
}

CSJS.Util = Util;
function Util() {}

// delimter for various util functions
Util.delimiter = ' ';


/*
 * Flattens an object
 * @param {object} object - object to flatten
 * @return {object} - flattened object
 */
Util.flatten = flatten;
function flatten(object) {
  var flattened = {},
    property,
    value,
    nextLevel,
    prefix;

  for(property in object) {
    value = object[property];

    if(typeof value === 'object' && value !== null) {

      nextLevel = flatten(value);
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


/*
 * Un-Flattens an object one level from the bottom
 * @param {object} object - object to un-flatten
 * @return {object} - un-flattened object
 */

// work in progress - a bit messy
// could probably use recursion

Util.unflatten = unflatten;
function unflatten(object) {
  var unflattened = {},
    property,
    value,
    propertySegments,
    nextProperty,
    remaining;

  for(property in object) {
    value = object[property];

    propertySegments = property.split(Util.delimiter);
    nextProperty = propertySegments.pop();
    remaining = propertySegments.join(Util.delimiter);

    if(remaining.length) {
      unflattened[remaining] = unflattened[remaining] || {};
      unflattened[remaining][nextProperty] = value;
    } else {
      unflattened[nextProperty] = value;
    }

  }

  return unflattened;
}


return CSJS;
});

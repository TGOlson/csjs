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

// auto compile style-sheets on any style changes
CSJS.autoCompile = true;

// minify style-sheets during compilation
CSJS.minify = false;

// id to use when one is not supplied
CSJS.defaultId = 'stylesheet';

// private list of style-sheets
CSJS._styleSheets = {};

CSJS.getStyleSheet = getStyleSheet;
function getStyleSheet(id) {
  if(id === undefined) throw new Error('Cannot get stylesheet without id.');
  return CSJS._styleSheets[id];
}

CSJS.addStyleSheet = addStyleSheet;
function addStyleSheet(styleSheet) {
  if(!CSJS.isStyleSheet(styleSheet)) {
    throw new Error('Object must be of type StyleSheet.');
  }

  var id = styleSheet.id,
    styleSheets = CSJS._styleSheets;

  if(styleSheets[id]) throw new Error('StyleSheet \'' + id + '\' already initialized.');

  styleSheets[id] = styleSheet;

  return styleSheet;
}

CSJS.removeStyleSheet = removeStyleSheet;
function removeStyleSheet(id) {
  if(id === undefined) throw new Error('Cannot remove stylesheet without id.');
  delete CSJS._styleSheets[id];
}

CSJS.isStyleSheet = isStyleSheet;
function isStyleSheet(object) {
  return object instanceof CSJS.StyleSheet;
}

CSJS.clearStyleSheets = clearStyleSheets;
function clearStyleSheets() {
  CSJS._styleSheets = {};
}

// expose main compiler function as library utility
// compile is defined under Compiler.compile
// not currently used in any core functionality
CSJS.compile = compile;


/**
 * Constructs a style-sheet which contains a direct reference of all styles
 * @param {string} id - [optional] style-sheet id
 * @param {object} blocks - [optional] styles declaration blocks to instantiate style-sheet with
 * @return {StyleSheet}
 */
CSJS.StyleSheet = StyleSheet;
function StyleSheet(id, styles) {

  if(!id || typeof id !== 'string') {
    styles = id;
  }

  id = id || CSJS._defaultId;

  this.id = id;
  this.styles = {};
  this.element = createStyleElement(id);

  CSJS.addStyleSheet(this);

  this.addStyles(styles);

  // should check to see if auto-compile is true
  this.compile();
}

StyleSheet.prototype.addStyles = function(styles) {
  var _styles = [],
    selector,
    declarations,
    style;

  styles = Compiler.preProcess(styles);

  for(selector in styles) {
    declarations = styles[selector];

    // should try to update existing styles first
    style = new Style(selector, declarations);

    this.styles[style.selector] = style;

    _styles.push(style);
  }

  return _styles;
};

function createStyleElement(id) {
  var style = createElement('style');
  style.type = 'text/css';
  setAttribute(style, "id", id);
  return style;
}

function createElement(name) {
  var element;

  if(hasDocument()) {
    element = document.createElement(name);
  } else {
    element = {name: name};
  }

  return element;
}

function setAttribute(object, attribute, value) {
  if(hasDocument()) {
    object.setAttribute(attribute, value);
  } else {
    object[attribute] = value;
  }

  return object;
}

StyleSheet.prototype.toCSS = function() {
  var css = [],
    styles = this.styles,
    selector,
    style;

  for(selector in styles) {
    style = styles[selector];
    css.push(style.toCSS());
  }

  return css.join('\n');
};

StyleSheet.prototype.compile = function() {
  var style = this.element,
    css = this.toCSS();

  style.innerHTML = css;

  if(hasDocument()) {
    document.getElementsByTagName('head')[0].appendChild(style);
  } else {
    // can't yet compile out of a browser setting
  }

};

function hasDocument() {
  // return false; // dev use
  return typeof document === 'object';
}


/**
 * Constructs a style objects which contains declarations
 * @param {string} selector - style selector
 * @param {object} declarationBlock - style declaration block
 */
CSJS.Style = Style;
function Style(selector, declarations) {
  this.selector = selector;
  this.declarations = declarations;
}

Style.prototype.toCSS = function() {
  return Compiler.compileBlock(this.selector, this.declarations);
};


/**
 * Constructs a compiler engine
 */
CSJS.Compiler = Compiler;
function Compiler() {}

// compiles a javascript object in compatible format to native css
Compiler.compile =  compile;
function compile(blocks) {
  if(typeof blocks !== 'object') throw new Error('Must supply object to compile.');

  var minify = CSJS.minify,
    delimiter = minify ? '' : '\n',
    css = [],
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

  return css.join(delimiter);
}

// pre-processor for css compilation
// flattens a java-script object
// then un-flattens one level from the bottom
Compiler.preProcess = preProcess;
function preProcess(blocks) {
  var processed = flatten(blocks);
  return unflatten(processed);
}

Compiler.compileBlock = compileBlock;
function compileBlock(selector, block) {
  var minify = CSJS.minify,
    newLine = minify ? '' : '\n',
    space = minify ? '' : ' ',
    css = selector + space + '{' + newLine,
    property,
    value;

  if(typeof block === 'function') {
    block = block(selector);
  }

  for(property in block) {
    value = block[property];

    if(typeof value === 'function') {
      value = value(property);
    }

    css += space + space + property + ':' + space + value + ';' + newLine;
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

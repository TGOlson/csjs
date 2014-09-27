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

// private list of style-sheet
CSJS._styleSheets = {};

// id to use when one is not supplied
CSJS._defaultId = 'stylesheet';


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

  if(CSJS._styleSheets[id]) throw new Error('StyleSheet \'' + id + '\' already initialized.');

  this.id = id;
  this.styles = {};
  this.addStyles(styles);
  this.autoCompile = CSJS.autoCompile;
  this.element = createStyleElement(id);

  CSJS._styleSheets[id] = this;

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

  if(typeof document === 'object') {
    element = document.createElement(name);
  } else {
    element = {name: name};
  }

  return element;
}

function setAttribute(object, attribute, value) {
  if(typeof document === 'object') {
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
  var style = this.element;

  if(typeof document === 'object') {
    style.innerHTML = this.toCSS();
    document.getElementsByTagName('head')[0].appendChild(style);
  } else {
    // can't yet compile out of a browser setting
  }

};


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
// then un-flattens one level from the bottom
Compiler.preProcess = preProcess;
function preProcess(blocks) {
  var processed = flatten(blocks);
  return unflatten(processed);
}

Compiler.compileBlock = compileBlock;
function compileBlock(selector, block) {
  var css = selector + ' {\n',
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

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

CSJS.styleSheets = [];

function addStyleSheet(styleSheet) {
  CSJS.styleSheets.push(styleSheet);
}

function removeStyleSheet(styleSheet) {
  var styleSheets = CSJS.styleSheets,
    index = styleSheets.indexOf(styleSheet);

  if(index > -1) {
    styleSheets.splice(index, 1);
  }
}

function isBrowser() {
  return typeof document === 'object';
}

function raise(error) {
  throw new Error(error);
}

// expose main compiler function as library utility
// compile is defined under Compiler.compile
// not currently used in any core functionality
// should this be a compileAll function?
CSJS.compile = compile;


/**
 * Constructs a style-sheet which contains a direct reference of all styles
 * @param {string} id - [optional] style-sheet id
 * @param {object} blocks - [optional] styles declaration blocks to instantiate style-sheet with
 * @return {StyleSheet}
 */
CSJS.StyleSheet = StyleSheet;
function StyleSheet(blocks) {
  validateBlocks(blocks);

  addStyleSheet(this);

  this.styles = {};
  this.element = createStyleElement();

  this.add(blocks);
}

StyleSheet.prototype.get = function(selector) {
  validateSelector(selector);
  return this.styles[selector];
};

// add, update, and addStyle should probably be made into one style
StyleSheet.prototype.add = function(blocks) {
  validateBlocks(blocks);

  var styles = [],
    selector,
    declarations,
    style;

  blocks = Compiler.preProcess(blocks);

  for(selector in blocks) {
    declarations = blocks[selector];

    style = this.addStyle(selector, declarations);

    styles.push(style);
  }

  this.compileIfAutoCompile();

  return styles;
};

// this assume declarations are in plain css format
// should be made private as a helper
StyleSheet.prototype.addStyle = function(selector, declarations) {
  var style = this.get(selector);

  if(style) {

    // update existing style if one exists
    style.update(declarations);
  } else {
    style = new Style(selector, declarations);

    // add to style-sheet style list if new
    this.styles[selector] = style;
  }

  // private helper should not compile
  // this.compileIfAutoCompile();

  return style;
};

StyleSheet.prototype.update = function(selector, declarations) {
  var style = this.get(selector);

  if(style) {
    this.compileIfAutoCompile();
    return style.update(declarations);
  } else {
    throw new Error('Cannot update undefined style');
  }
};

StyleSheet.prototype.remove = function(selector) {
  return delete this.styles[selector];
};

StyleSheet.prototype.destroy = function() {
  // should also remove element from dom
  this.element.innerHTML = '';
  return removeStyleSheet(this);
};

StyleSheet.prototype.toCSS = function() {
  var delimiter = CSJS.minify ? '' : '\n',
    styles = this.styles,
    css = [],
    selector,
    style;

  for(selector in styles) {
    style = styles[selector];
    css.push(style.css);
  }

  return css.join(delimiter);
};

StyleSheet.prototype.compileIfAutoCompile = function() {
  if(CSJS.autoCompile) this.compile();
  return this;
};

StyleSheet.prototype.compile = function() {
  this.element.innerHTML = this.toCSS();
  return this;
};

function createStyleElement() {
  var name = 'STYLE',
    style;

  // if in the browser, create element and append
  if(isBrowser()) {
    style = document.createElement(name);
    document.getElementsByTagName('head')[0].appendChild(style);

  // otherwise, create plain object to hold data
  } else {
    style = {tagName: name};
  }

  style.type = 'text/css';

  return style;
}

function validateBlocks(blocks) {
  if(blocks && typeof blocks !== 'object') raise('Invalid style blocks.');
}

function validateSelector(selector) {
  if(typeof selector !== 'string') raise('Invalid selector.');
}


/**
 * Constructs a style objects which contains declarations
 * @param {string} selector - style selector
 * @param {object} declarationBlock - style declaration block
 */

// new style objects should not be directly instantiated
// this will leave them without any parent style-sheet
// use styleSheet.addStyle to create new styles
CSJS.Style = Style;
function Style(selector, declarations) {
  validateSelector(selector);

  this.selector = selector || null;
  this.declarations = declarations || {};

  this.compile();
}

Style.prototype.get = function(property) {
  var declarations = this.declarations,
    value;

  // invoke any functional declarations
  if(typeof declarations === 'function') {
    declarations = declarations(this.selector);
  }

  value = declarations[property];

  // invoke any functional values
  if(typeof value === 'function') {
    value = value(this.selector);
  }

  return value;
};

// set and update should be combined into one function
Style.prototype.set = function(property, value) {
  validateProperty(property);

  if(!this.canUpdate()) {
    throw new Error('Cannot update style with functional declarations.');
  }

  this.declarations[property] = value;
  return this.compile();
};

// TODO: Look into bugs with updating functional declarations
// styles may be lost if a new declaration is added
// to a style with preexisting functional declarations
// or if a functional declaration is updated with a functional value
// basically - updating functional references
// should either set or overwrite all old declarations
// or invoke function and make declarations static from then on
// for now, just throw an error
Style.prototype.update = function(declarations) {
  validateDeclarations(declarations);

  if(!this.canUpdate()) {
    throw new Error('Cannot update style with functional declarations.');
  }

  var property,
    value;

  for(property in declarations) {
    value = declarations[property];
    this.set(property, value);
  }

  return this.compile();
};

Style.prototype.remove = function(property) {
  if(!property) {
    this.declarations = {};
  } else {
    validateProperty(property);
    delete this.declarations[property];
  }

  return this.compile();
};

Style.prototype.destroy = function() {
  // implement - would need to notify parent style-sheet
};

// styles are always auto-compiled after any update
// this greatly improves style-sheet compilation time
// but need to be careful to update css property on any update to style
Style.prototype.compile = function() {
  this.css = this.toCSS();
  return this;
};

Style.prototype.toCSS = function() {
  return Compiler.compileBlock(this.selector, this.declarations);
};

// check if the style can be updated
// styles with functional declarations cannot be updated
Style.prototype.canUpdate = function() {
  return typeof this.declarations !== 'function';
};

function validateProperty(property) {
  if(property && typeof property !== 'string') raise('Invalid property.');
}


function validateDeclarations(declarations) {
  if(typeof declarations !== 'object') raise('Invalid declarations');
}

/**
 * Constructs a compiler engine
 */
CSJS.Compiler = Compiler;
function Compiler() {}

// compiles a javascript object in compatible format to native css
// skipping pre-processing can make compilation much faster
// however, it will only work if styles are written in standard css (not-nested) format
Compiler.compile =  compile;
function compile(blocks, skipPreProcess) {
  validateBlocks(blocks);

  var delimiter = CSJS.minify ? '' : '\n',
    css = [],
    selector,
    block,
    cssBlock;

  if(!skipPreProcess) blocks = preProcess(blocks);

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
  var newLine = CSJS.minify ? '' : '\n',
    space = CSJS.minify ? '' : ' ',
    css = [],
    property,
    value;

  // hard-coded to regex out parent selectors
  // should be part of an earlier compilation process
  // this adds a consistent 15ms in the 50 sets / 100 block test.
  selector = selector.replace(/\s&/g, '');

  css.push(selector, space, '{', newLine);

  if(typeof block === 'function') {
    block = block(selector);
  }

  for(property in block) {
    value = block[property];

    if(typeof value === 'function') {
      value = value(property);
    }

    css.push(space, space, property, ':', space, value, ';', newLine);
  }

  css.push('}');

  return css.join('');
}

CSJS.Util = Util;
function Util() {}

// delimiter for various utility functions
// should not be modified
Util._delimiter = ' ';


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

      property = property + Util._delimiter;

      Util.merge(flattened, nextLevel, property);

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

    propertySegments = property.split(Util._delimiter);
    nextProperty = propertySegments.pop();
    remaining = propertySegments.join(Util._delimiter);

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

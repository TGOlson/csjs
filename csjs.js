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

// enforce unique style-sheet ids
// auto increment duplicate ids otherwise
CSJS.uniqueId = false;

// id to use when one is not supplied
CSJS.defaultId = 'style-sheet';

// private list of style-sheets
CSJS._styleSheets = {};


CSJS.getStyleSheet = getStyleSheet;
function getStyleSheet(id) {
  if(!validId(id)) throw new Error('Invalid id.');
  return CSJS._styleSheets[id];
}

// private cache helper
// not for external use
function addStyleSheet(styleSheet) {
  if(!CSJS.isStyleSheet(styleSheet)) {
    throw new Error('Object must be of type StyleSheet.');
  }

  var id = styleSheet.id,
    styleSheets = CSJS._styleSheets,
    idExists = !!CSJS.getStyleSheet(id);

  if(idExists) {
    if(CSJS.uniqueId) {
      throw new Error('StyleSheet \'' + id + '\' already initialized.');
    } else {
      id = CSJS.nextId(id);
      styleSheet.id = id;
    }
  }

  styleSheets[id] = styleSheet;

  return styleSheet;
}

CSJS.nextId = nextId;
function nextId(id) {
  var next = id,
    styleSheet = CSJS.getStyleSheet(next),
    i;

  // should this be a while loop?
  for(i = 2; styleSheet; i++) {
    next = id + '-' + i;
    styleSheet = CSJS.getStyleSheet(next);
  }

  return next;
}

CSJS.removeStyleSheet = removeStyleSheet;
function removeStyleSheet(id) {
  if(!validId(id)) throw new Error('Invalid id.');

  var styleSheet = CSJS.getStyleSheet(id);

  if(styleSheet) delete CSJS._styleSheets[id];

  return styleSheet;
}

CSJS.isStyleSheet = isStyleSheet;
function isStyleSheet(object) {
  return object instanceof CSJS.StyleSheet;
}

CSJS.clearStyleSheets = clearStyleSheets;
function clearStyleSheets() {
  CSJS._styleSheets = {};
}

function validId(id) {
  return typeof id === 'string';
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
function StyleSheet(id, blocks) {

  if(!id || typeof id !== 'string') {
    blocks = id;
    id = CSJS.defaultId;
  }

  this.id = id;

  addStyleSheet(this);

  this.styles = {};
  this.element = createStyleElement(this.id);

  this.addStyles(blocks);

  // should check to see if auto-compile is true
  this.compile();
}

StyleSheet.prototype.getStyle = function(selector) {
  if(!validSelector(selector)) throw new Error('Invalid selector.');
  return this.styles[selector];
};

StyleSheet.prototype.addStyles = function(blocks) {
  if(blocks && !validBlocks(blocks)) throw new Error('Invalid style blocks.');

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

  return styles;
};

// this assume declarations are in plain css format
StyleSheet.prototype.addStyle = function(selector, declarations) {
  var style = this.getStyle(selector);

  // might need to pre-process declarations

  // should add logic to allow passing in of already created style object
  // if(selector instanceof CSJS.Style) style = selector;

  if(style) {

    // update existing style if one exists
    style.update(declarations);
  } else {
    style = new Style(selector, declarations);

    // add to style-sheet style list if new
    this.styles[selector] = style;
  }

  return style;
};

StyleSheet.prototype.updateStyle = function(selector, declarations) {
  var style = this.getStyle(selector);

  if(style) {
    return style.update(declarations);
  } else {
    throw new Error('Cannot update undefined style');
  }
};

StyleSheet.prototype.removeStyle = function(selector) {
  var style = this.getStyle(selector);
  if(style) delete this.styles[selector];
  return style;
};

function createStyleElement(id) {
  var name = 'style',
    style;

  // if in the browser, do create actual element and append
  if(isBrowser()) {
    style = document.createElement(name);
    style.setAttribute('id', id);
    document.getElementsByTagName('head')[0].appendChild(style);

  // otherwise, create plain object to hold data
  } else {

    // mimic element properties
    style = {
      tagName: name.toUpperCase(),
      id: id
    };
  }

  style.type = 'text/css';

  return style;
}

StyleSheet.prototype.toCSS = function() {
  var minify = CSJS.minify,
    delimiter = minify ? '' : '\n',
    styles = this.styles,
    css = [],
    selector,
    style;

  for(selector in styles) {
    style = styles[selector];

    // use style css property
    // this is much faster than re-compiling each style
    // but assume that style css is kept up to date
    css.push(style.css);
  }

  return css.join(delimiter);
};

StyleSheet.prototype.compile = function() {
  var css = this.toCSS();
  this.element.innerHTML = css;
  return this;
};

// StyleSheet.

function isBrowser() {
  // return false; // dev use
  return typeof document === 'object';
}

function validSelector(selector) {
  return typeof selector === 'string';
}

function validBlocks(blocks) {
  return typeof blocks === 'object';
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
  if(!validSelector(selector)) throw new Error('Invalid selector.');

  this.selector = selector || null;
  this.declarations = declarations || {};

  // setting css property greatly speeds up compilation time
  // but need to be careful to update css property on any update to style
  this.compile();
}

// styles are always auto-compiled after any update
// this greatly improves style-sheet compilation time
Style.prototype.compile = function() {
  this.css = this.toCSS();
  return this;
};

Style.prototype.toCSS = function() {
  return Compiler.compileBlock(this.selector, this.declarations);
};

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

Style.prototype.set = function(property, value) {
  if(!validProperty(property)) throw new Error('Invalid property.');

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
  if(!validDeclarations(declarations)) throw new Error('Invalid declarations.');

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
  if(property && !validProperty(property)) throw new Error('Invalid property.');

  if(!property) {

    // clear all declarations if no property is specified
    this.declarations = {};
  } else {
    delete this.declarations[property];
  }

  return this.compile();
};

// check if the style can be updated
// styles with functional declarations cannot be updated
Style.prototype.canUpdate = function() {
  return this.declarations !== 'function';
};

function validDeclarations(declarations) {
  return typeof declarations === 'object';
}

function validProperty(property) {
  return typeof property === 'string';
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
  if(typeof blocks !== 'object') throw new Error('Must supply object to compile.');

  var minify = CSJS.minify,
    delimiter = minify ? '' : '\n',
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
  var minify = CSJS.minify,
    newLine = minify ? '' : '\n',
    space = minify ? '' : ' ',
    css = [],
    property,
    value;

  // css = selector + space + '{' + newLine,

  css.push(selector);
  css.push(space);
  css.push('{');
  css.push(newLine);

  if(typeof block === 'function') {
    block = block(selector);
  }

  for(property in block) {
    value = block[property];

    if(typeof value === 'function') {
      value = value(property);
    }

    // css += space + space + property + ':' + space + value + ';' + newLine;

    css.push(space);
    css.push(space);
    css.push(property);
    css.push(':');
    css.push(space);
    css.push(value);
    css.push(';');
    css.push(newLine);
  }

  css.push('}');

  return css.join('');
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

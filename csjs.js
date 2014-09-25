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
function jsToCSS(declarationBlocks) {
  var css = [],
    selector,
    declarationBlock,
    compiledStyle;

  for(selector in declarationBlocks) {
    declarationBlock = declarationBlocks[selector];

    // invoke any functions, passing in the selector
    if(typeof declarationBlock === 'function') declarationBlock = declarationBlock(selector);

    compiledStyle = selectorAndDeclarationBlockToCSS(selector, declarationBlock);
    css.push(compiledStyle);
  }

  return css.join('\n');
}

Compiler.selectorAndDeclarationBlockToCSS = selectorAndDeclarationBlockToCSS;
function selectorAndDeclarationBlockToCSS(selector, declarationBlock) {
  var css = selector + JSON.stringify(declarationBlock);

  // add space new line after opening bracket, followed by two spaces
  return css.replace(/{/g, ' {\n  ')

  // remove all double quotes created from stringifying
  .replace(/"/g, '')

  // convert commas to semicolons, adding extra space
  .replace(/,/g, ';\n  ')

  // add extra space after each colon
  .replace(/:/g, ': ')

  // add closing semicolon and new line before closing brackets
  .replace(/}/g, ';\n}');
}

return CSJS;
});

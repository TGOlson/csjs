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
function jsToCSS(declarationBlocks, previousSelector) {
  var css = [],
    selector,
    declarationBlock,
    cssBlock,
    property,
    value,
    endOfDeclarationBlock,
    declarationPrefix = '';

  for(selector in declarationBlocks) {
    declarationBlock = declarationBlocks[selector];

    // invoke any functions, passing in the selector
    if(typeof declarationBlock === 'function') declarationBlock = declarationBlock(selector);


    if(previousSelector) selector = previousSelector + ' ' + selector;


    // add opening brace and a new line
    cssBlock = declarationPrefix + selector + ' {\n';

    for(property in declarationBlock) {
      value = declarationBlock[property];

      console.log(value, selector);

      if(typeof value === 'object') {

        // this stops the entire compilation process
        // multi level nested selectors will not work
        return jsToCSS(declarationBlock, selector);
        // return;
      } else {


        // indent property with two spaces and add a colon
        // end declaration with semicolon and a new line
        cssBlock += '  ' + property + ': ' + value + ';\n';
        console.log(cssBlock);
        endOfDeclarationBlock = true;
      }
    }

    if(endOfDeclarationBlock) cssBlock += '}';

    // add closing brace and a new line
    css.push(cssBlock);
  }

  return css.join('\n');
}

return CSJS;
});

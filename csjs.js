(function(definition) {

  CSJS = definition();

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
  function StyleSheet(styleObject, id) {}


  /**
   * Constructs a style objects which contains declarations
   * @param {string} selector - style selector
   * @param {object} declarationBlock - style declaration block
   */
  CSJS.Style = Style;
  function Style(selector, declarationBlock) {}

  /**
   * Constructs a compiler engine
   * Private function
   */
  function Compiler() {}

});

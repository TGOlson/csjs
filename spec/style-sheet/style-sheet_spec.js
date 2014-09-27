var CSJS = require('../../csjs'),
  StyleSheet = CSJS.StyleSheet;

describe('StyleSheet', function() {

  beforeEach(function() {

    // reset stylesheet cache before each test
    CSJS._styleSheets = {};
  });

  describe('instantiation', function() {
    it('should create a new StyleSheet instance', function() {
      var styleSheet = new StyleSheet();
      expect(styleSheet instanceof StyleSheet).toBe(true);
    });

    it('should create a StyleSheet with a default id if none is supplied', function() {
      var styleSheet = new StyleSheet();
      expect(styleSheet.id).toBe('stylesheet');
    });

    it('should create a new StyleSheet with an id', function() {
      var styleSheet = new StyleSheet('main');
      expect(styleSheet.id).toBe('main');
    });

    it('should throw an error if a StyleSheet is already created with an id', function() {
      var styleSheet = new StyleSheet();

      expect(function newStyleSheet() {
        return new StyleSheet();
      }).toThrow();
    });

    it('should create a new StyleSheet with a style property', function() {
      var styleSheet = new StyleSheet('main');
      expect(styleSheet.styles).toBeDefined();
    });

    it('should set an element property', function() {
      var styleSheet = new StyleSheet();

      expect(styleSheet.element.name).toBe('style');
    });

    it('should set styles if a block is passed in', function() {
      var styleSheet = new StyleSheet({
        p: {color: 'green'}
      });

      var style = styleSheet.styles.p;

      expect(style instanceof CSJS.Style).toBe(true);
    });

  });

});

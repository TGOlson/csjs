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

    it('should create a new StyleSheet of true is the default setting is true', function() {
      var styleSheet = new StyleSheet('main');
      expect(styleSheet.autoCompile).toBe(true);
    });

    it('should create a new StyleSheet of false is the default setting is false', function() {
      CSJS.autoCompile = false;

      var styleSheet = new StyleSheet('main');

      expect(styleSheet.autoCompile).toBe(false);
    });

    it('should change auto compile settings if the default is set after instantiation', function() {
      var styleSheet = new StyleSheet('main');

      CSJS.autoCompile = false;

      expect(styleSheet.autoCompile).toBe(false);
    });

    it('should set an element property', function() {
      var styleSheet = new StyleSheet();

      expect(styleSheet.element.name).toBe('style');
    });

    it('should set styles if a block is passed in', function() {
      var styleSheet = new StyleSheet({
        p: {color: 'green'}
      });

      // console.log(st)

      // TODO: update this
      expect(styleSheet.styles).toBeDefined();
    });

  });

});

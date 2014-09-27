var CSJS = require('../csjs');

describe('CSJS', function() {

  beforeEach(function() {

    // reset style-sheet cache before each test
    CSJS.clearStyleSheets();
  });

  it('should have a style-sheet module', function() {
    expect(CSJS.StyleSheet).toBeDefined();
  });

  it('should have a style module', function() {
    expect(CSJS.Style).toBeDefined();
  });

  it('should have a compiler module', function() {
    expect(CSJS.Compiler).toBeDefined();
  });

  it('should have a util module', function() {
    expect(CSJS.Util).toBeDefined();
  });

  it('should have a default auto-compile setting', function() {
    expect(CSJS.autoCompile).toBe(true);
  });

  it('should have a default minify setting', function() {
    expect(CSJS.minify).toBe(false);
  });

  it('should have a default id setting', function() {
    expect(CSJS.defaultId).toBe('style-sheet');
  });

  describe('getStyleSheet', function() {
    it('should throw an error if passed an invalid id', function() {
      expect(CSJS.getStyleSheet).toThrow();
    });

    it('should return undefined if no style-sheet exists with specified id', function() {
      var styleSheet = CSJS.getStyleSheet('not-here');
      expect(styleSheet).toBeUndefined();
    });

    it('should return a style-sheet if one exists with specified id', function() {
      var id = 'fake-style-sheet',
        styleSheet = {id: id};

      CSJS._styleSheets[id] = styleSheet;

      expect(CSJS.getStyleSheet(id)).toBe(styleSheet);
    });
  });

  describe('removeStyleSheet', function() {
    it('should throw an error if not provided with a style-sheet', function() {
      expect(CSJS.removeStyleSheet).toThrow();
    });

    it('should remove a style-sheet from the cache', function() {
      var id = 'fake-style-sheet';

      CSJS._styleSheets[id] = {id: id};

      CSJS.removeStyleSheet(id);

      expect(CSJS._styleSheets[id]).toBeUndefined();
    });

    it('should return the removed style-sheet', function() {
      var id = 'fake-style-sheet',
        styleSheet = {id: id},
        removed;

      CSJS._styleSheets[id] = styleSheet;
      removed = CSJS.removeStyleSheet(id);

      expect(removed).toBe(styleSheet);
    });
  });

  describe('isStyleSheet', function() {
    it('should return false if object is not a style-sheet', function() {
      var isStyleSheet = CSJS.isStyleSheet(123);
      expect(isStyleSheet).toBe(false);
    });

    it('should return false if object is undefined', function() {
      var isStyleSheet = CSJS.isStyleSheet();
      expect(isStyleSheet).toBe(false);
    });

    it('should return true if object is a style-sheet', function() {
      var styleSheet = new CSJS.StyleSheet();
        isStyleSheet = CSJS.isStyleSheet(styleSheet);

      expect(isStyleSheet).toBe(true);
    });
  });

  describe('clearStyleSheets', function() {
    it('should clear all style-sheets from cache', function() {
      CSJS._styleSheets = {
        fake1: 1,
        fake2: 2,
        fake3: 3
      };

      CSJS.clearStyleSheets();

      expect(CSJS._styleSheets).toEqual({});
    });
  });

  describe('compile', function() {
    it('should be the compiler compilation method', function() {
      expect(CSJS.compile).toBe(CSJS.Compiler.compile);
    });
  });

});

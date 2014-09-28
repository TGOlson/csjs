var CSJS = require('../csjs');

describe('CSJS', function() {

  beforeEach(function() {

    // reset style-sheet cache before each test
    CSJS.styleSheets = [];
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

  describe('compile', function() {
    it('should be the compiler compilation method', function() {
      expect(CSJS.compile).toBe(CSJS.Compiler.compile);
    });
  });

});

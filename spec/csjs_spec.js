var CSJS = require('../csjs');

describe('CSJS', function() {

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

});

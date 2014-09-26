var Util = require('../../csjs').Util,
  merge = Util.merge;

describe('Util.merge', function() {
  it('should destructively merge an object with source data', function() {
    var object = {1: 2},
        source = {3: 4, 5: 6},
        merged = {1: 2, 3: 4, 5: 6};

    merge(object, source);

    expect(object).toEqual(merged);
  });

  it('should return the original object', function() {
    var object = {},
        source = {1: 2, 3: 4},
        merged = merge(object, source);

    expect(object).toBe(merged);
  });

  it('should prefix the merged properties', function() {
    var object = {1: 2},
        source = {3: 4, 5: 6},
        merged = {1: 2, '!3': 4, '!5': 6};

    merge(object, source, '!');

    expect(object).toEqual(merged);
  });
});

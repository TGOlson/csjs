var Util = require('../../csjs').Util,
  unflatten = Util.unflatten;

describe('Util.unflatten', function() {
  it('should return an already flat object', function() {
    var object = {1: 2};

    expect(unflatten(object)).toEqual({1: 2});
  });

  it('should un-flatten a simple flat object', function() {
    var object = {'1 2': 3};

    expect(unflatten(object)).toEqual({1: {2: 3}});
  });

  it('should un-flatten a flat object with multiple paths', function() {
    var object = {'1 2': 3, '5 6': 7};

    expect(unflatten(object)).toEqual({1: {2: 3}, 5: {6: 7}});
  });

  it('should un-flatten a more complex object', function() {
    var object = {
      '1 2': 3,
      '1 4 5': 6,
      '1 7 8': 9,
      '1 7 10': 11,
      '12': 13
    };

    var unflattened = {
      1: {2: 3},
      '1 4': {5: 6},
      '1 7': {8: 9, 10: 11},
      12: 13,
    };

    expect(unflatten(object)).toEqual(unflattened);
  });
});

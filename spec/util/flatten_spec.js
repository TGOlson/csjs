var Util = require('../../csjs').Util,
  flatten = Util.flatten;

describe('Util.flatten', function() {
  it('should return an already flattened object', function() {
    var object = {1: 2};

    expect(flatten(object)).toEqual({1: 2});
  });

  it('should flatten a simple object with depth', function() {
    var object = {1: {2: 3}};

    expect(flatten(object)).toEqual({'1 2': 3});
  });


  it('should flatten an object with multiple paths', function() {
    var object = {1: {2: 3}, 5: {6: 7}};

    expect(flatten(object)).toEqual({'1 2': 3, '5 6': 7});
  });

  it('should flatten an object with complex paths', function() {
    var object = {
      1: {
        2: 3,
        4: {5: 6},
        7: {8: 9, 10: 11}
      },
      12: 13
    };

    var flattened = {
      '12': 13,
      '1 2': 3,
      '1 4 5': 6,
      '1 7 8': 9,
      '1 7 10': 11
    };

    expect(flatten(object)).toEqual(flattened);
  });

  it('should flatten an object with complex paths using the shallow flag', function() {
    var object = {
      1: {
        2: 3,
        4: {5: 6},
        7: {8: 9, 10: 11}
      },
      12: 13
    };

    var flattened = {
      '12': 13,
      '1 2': 3,
      '1 4': { '5': 6 },
      '1 7': { '8': 9, '10': 11 }
    };

    expect(flatten(object, true)).toEqual(flattened);
  });


  it('should flatten an object null values', function() {
    var object = {1: {2: null}};

    expect(flatten(object)).toEqual({'1 2': null});
  });

  it('should flatten an object array values', function() {
    var object = {1: {2: ['a', 'b']}};

    var flattened = {
      '1 2 0': 'a',
      '1 2 1': 'b'
    };

    expect(flatten(object)).toEqual(flattened);
  });

});

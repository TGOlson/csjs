var Compiler = require('../../csjs').Compiler,
  compile = Compiler.compile;

describe('Compiler.compile', function() {
  it('should convert a simple compatible javascript object to css', function() {
    var object = {
      p: {color: 'red'}
    };

    var css = 'p {\n' +
              '  color: red;\n' +
              '}';

    expect(compile(object)).toBe(css);
  });

  it('should convert a simple compatible javascript object with multiple properties to css', function() {
    var object = {
      p: {
        color: 'red',
        margin: '5px'
      }
    };

    var css = 'p {\n' +
              '  color: red;\n' +
              '  margin: 5px;\n' +
              '}';

    expect(compile(object)).toBe(css);
  });

  it('should convert a compatible javascript object with multiple declaration blocks to css', function() {
    var object = {
      h1: {'background-color': 'blue'},
      p: {color: 'red'}
    };

    var css = 'h1 {\n' +
              '  background-color: blue;\n' +
              '}\n' +
              'p {\n' +
              '  color: red;\n' +
              '}';

    expect(compile(object)).toBe(css);
  });

  it('should convert multiple value properties to css', function() {
    var object = {
      p: {border: '1px solid #eee'}
    };

    var css = 'p {\n' +
              '  border: 1px solid #eee;\n' +
              '}';

    expect(compile(object)).toBe(css);
  });

  it('should invoke functions that are values in declaration blocks', function() {
    var object = {
      h1: function() {
        return {'font-size': '20px'};
      }
    };

    var css = 'h1 {\n' +
              '  font-size: 20px;\n' +
              '}';

    expect(compile(object)).toBe(css);
  });

  it('should convert a class declaration to css', function() {
    var object = {
      '.header': {width: '100%'}
    };

    var css = '.header {\n' +
              '  width: 100%;\n' +
              '}';

    expect(compile(object)).toBe(css);
  });

  it('should convert an id declaration to css', function() {
    var object = {
      '#header': {width: '100%'}
    };

    var css = '#header {\n' +
              '  width: 100%;\n' +
              '}';

    expect(compile(object)).toBe(css);
  });

  it('should convert a sudo-selector to css', function() {
    var object = {
      'button:hover': {color: 'green'}
    };

    var css = 'button:hover {\n' +
              '  color: green;\n' +
              '}';

    expect(compile(object)).toBe(css);
  });

  it('should convert a parent selector to css', function() {
    var object = {
      'div > p': {color: 'green'}
    };

    var css = 'div > p {\n' +
              '  color: green;\n' +
              '}';

    expect(compile(object)).toBe(css);
  });

  it('should convert a sibling selector to css', function() {
    var object = {
      'div ~ p': {color: 'green'}
    };

    var css = 'div ~ p {\n' +
              '  color: green;\n' +
              '}';

    expect(compile(object)).toBe(css);
  });

  it('should convert a child selector to css', function() {
    var object = {
      'p:nth-child(2)': {
        color: 'green'
      }
    };

    var css = 'p:nth-child(2) {\n' +
              '  color: green;\n' +
              '}';

    expect(compile(object)).toBe(css);
  });

  it('should convert simple nested selectors to css', function() {
    var object = {
      ul: {
        li: {'list-style': 'none'}
      }
    };

    var css = 'ul li {\n' +
              '  list-style: none;\n' +
              '}';

    expect(compile(object)).toBe(css);
  });

  it('should convert simple a nested selector with multiple properties to css', function() {
    var object = {
      ul: {
        li: {
          'list-style': 'none',
          padding: '5px'
        }
      }
    };

    var css = 'ul li {\n' +
              '  list-style: none;\n' +
              '  padding: 5px;\n' +
              '}';

    expect(compile(object)).toBe(css);
  });

  it('should convert multiple nested selectors to css', function() {
    var object = {
      div: {
        h1: {color: 'red'},
        p: {color: 'green'},
      }
    };

    var css = 'div h1 {\n' +
              '  color: red;\n' +
              '}\n' +
              'div p {\n' +
              '  color: green;\n' +
              '}';

    expect(compile(object)).toBe(css);
  });

  it('should convert multiple nested selectors with multiple properties to css', function() {
    var object = {
      div: {
        h1: {
          color: 'red',
          margin: '10px'
        },
        p: {
          color: 'green',
          'background-color': 'purple'
        },
      }
    };

    var css = 'div h1 {\n' +
              '  color: red;\n' +
              '  margin: 10px;\n' +
              '}\n' +
              'div p {\n' +
              '  color: green;\n' +
              '  background-color: purple;\n' +
              '}';

    expect(compile(object)).toBe(css);
  });

  it('should convert many nested selectors to css', function() {
    var object = {
      div: {
        h1: {color: 'red'},
        p: {color: 'green'},
        ul: {color: 'blue'},
        span: {color: 'purple'},
      }
    };

    var css = 'div h1 {\n' +
              '  color: red;\n' +
              '}\n' +
              'div p {\n' +
              '  color: green;\n' +
              '}\n' +
              'div ul {\n' +
              '  color: blue;\n' +
              '}\n' +
              'div span {\n' +
              '  color: purple;\n' +
              '}';

    expect(compile(object)).toBe(css);
  });

  it('should convert deeply nested selectors to css', function() {
    var object = {
      div: {
        ul: {
          li: {
            span: {color: 'red'}
          },
        }
      }
    };

    var css = 'div ul li span {\n' +
              '  color: red;\n' +
              '}';

    expect(compile(object)).toBe(css);
  });

  it('should convert nested multi-level styles to css', function() {
    var object = {
      div: {
        padding: '20px',
        p: {color: 'red'}
      }
    };

    var css = 'div {\n' +
              '  padding: 20px;\n' +
              '}\n' +
              'div p {\n' +
              '  color: red;\n' +
              '}';

    expect(compile(object)).toBe(css);
  });
});

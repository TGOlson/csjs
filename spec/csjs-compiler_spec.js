var Compiler = require('../csjs').Compiler;

describe('Compiler', function() {
  // var compiler;

  // beforeEach(function() {
  //   compiler = new Compiler();
  // });

  describe('jsToCSS', function() {
    it('should convert a simple compatible javascript object to css', function() {
      var object = {
        p: {color: 'red'}
      };

      var css = 'p {\n' +
                '  color: red;\n' +
                '}';

      expect(Compiler.jsToCSS(object)).toBe(css);
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

      expect(Compiler.jsToCSS(object)).toBe(css);
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

      expect(Compiler.jsToCSS(object)).toBe(css);
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

      expect(Compiler.jsToCSS(object)).toBe(css);
    });

    it('should convert a class declaration to css', function() {
      var object = {
        '.header': {
          width: '100%'
        }
      };

      var css = '.header {\n' +
                '  width: 100%;\n' +
                '}';

      expect(Compiler.jsToCSS(object)).toBe(css);
    });

    it('should convert an id declaration to css', function() {
      var object = {
        '#header': {
          width: '100%'
        }
      };

      var css = '#header {\n' +
                '  width: 100%;\n' +
                '}';

      expect(Compiler.jsToCSS(object)).toBe(css);
    });

    it('should convert an sudo selector to css', function() {
      var object = {
        'button:hover': {
          color: 'green'
        }
      };

      var css = 'button:hover {\n' +
                '  color: green;\n' +
                '}';

      expect(Compiler.jsToCSS(object)).toBe(css);
    });

    it('should convert a parent selector to css', function() {
      var object = {
        'div > p': {
          color: 'green'
        }
      };

      var css = 'div > p {\n' +
                '  color: green;\n' +
                '}';

      expect(Compiler.jsToCSS(object)).toBe(css);
    });

    it('should convert a sibling selector to css', function() {
      var object = {
        'div ~ p': {
          color: 'green'
        }
      };

      var css = 'div ~ p {\n' +
                '  color: green;\n' +
                '}';

      expect(Compiler.jsToCSS(object)).toBe(css);
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

      expect(Compiler.jsToCSS(object)).toBe(css);
    });
  });

});

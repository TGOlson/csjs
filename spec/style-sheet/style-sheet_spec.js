var CSJS = require('../../csjs'),
  StyleSheet = CSJS.StyleSheet;

describe('StyleSheet', function() {

  beforeEach(function() {

    // reset style-sheet cache before each test
    CSJS.styleSheets = [];
  });

  describe('instantiation', function() {
    afterEach(function() {

      // reset any changed defaults after each test
      CSJS.uniqueId = false;
    });

    it('should create a new StyleSheet instance', function() {
      var styleSheet = new StyleSheet();
      expect(styleSheet instanceof StyleSheet).toBe(true);
    });

    it('should create a new StyleSheet with a style property', function() {
      var styleSheet = new StyleSheet();
      expect(styleSheet.styles).toEqual({});
    });

    it('should set an element property', function() {
      var styleSheet = new StyleSheet();

      var expectedElement = {
        tagName: 'STYLE',
        type: 'text/css',
        innerHTML: ''
      };

      expect(styleSheet.element).toEqual(expectedElement);
    });

    it('should set styles if a block is passed in', function() {
      var styleSheet = new StyleSheet({
        p: {color: 'green'}
      });

      var style = styleSheet.styles.p;

      expect(style instanceof CSJS.Style).toBe(true);
    });
  });

  describe('get', function() {
    it('should throw an error if passed an invalid selector', function() {
      var styleSheet = new StyleSheet();
      expect(styleSheet.get).toThrow();
    });

    it('should return undefined if no style exists', function() {
      var styleSheet = new StyleSheet(),
        style = styleSheet.get('not-defined');

      expect(style).toBeUndefined();
    });

    it('should return a style if one exists', function() {
      var styleSheet = new StyleSheet({p: {color: 'red'}}),
        style = styleSheet.get('p');

      expect(style instanceof CSJS.Style).toBe(true);
    });
  });

  describe('add', function() {
    it('should throw an error if passed invalid style blocks', function() {
      var styleSheet = new StyleSheet(),
        added = styleSheet.add.bind(styleSheet, 123);

      expect(added).toThrow();
    });

    it('should return an empty array if not passed any style blocks', function() {
      var styleSheet = new StyleSheet(),
        styles = styleSheet.add();

      expect(styles).toEqual([]);
    });

    it('should return all declared styles if passed valid style blocks', function() {
      var styleSheet = new StyleSheet(),
        styles = styleSheet.add({
            p: {color: 'green'},
            div: {border: '1px solid black'}
          });

      expect(styles.length).toBe(2);
    });

    it('should return a style object for each valid style if nested styles are present', function() {
      var styleSheet = new StyleSheet(),
        styles = styleSheet.add({
            p: {color: 'green'},
            div: {
              border: '1px solid black',
              span: {color: 'red'}
            }
          });

      expect(styles.length).toBe(3);
    });

    it('should add the styles to the style-sheet', function() {
      var styleSheet = new StyleSheet(),
        styles = styleSheet.add({
            p: {color: 'green'},
            div: {
              border: '1px solid black',
              span: {color: 'red'}
            }
          }),

        styleCount = Object.keys(styleSheet.styles).length;

      expect(styleCount).toBe(3);
    });
  });

});

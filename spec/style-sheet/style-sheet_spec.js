var CSJS = require('../../csjs'),
  StyleSheet = CSJS.StyleSheet;

ddescribe('StyleSheet', function() {

  beforeEach(function() {

    // reset style-sheet cache before each test
    CSJS.clearStyleSheets();
  });

  describe('instantiation', function() {
    it('should create a new StyleSheet instance', function() {
      var styleSheet = new StyleSheet();
      expect(styleSheet instanceof StyleSheet).toBe(true);
    });

    it('should create a StyleSheet with a default id if none is supplied', function() {
      var styleSheet = new StyleSheet();
      expect(styleSheet.id).toBe('style-sheet');
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

    it('should set an element property', function() {
      var styleSheet = new StyleSheet();

      expect(styleSheet.element.name).toBe('style');
    });

    it('should set styles if a block is passed in', function() {
      var styleSheet = new StyleSheet({
        p: {color: 'green'}
      });

      var style = styleSheet.styles.p;

      expect(style instanceof CSJS.Style).toBe(true);
    });
  });

  describe('getStyle', function() {
    it('should throw an error if passed an invalid selector', function() {
      var styleSheet = new StyleSheet();
      expect(styleSheet.getStyle).toThrow();
    });

    it('should return undefined if no style exists', function() {
      var styleSheet = new StyleSheet(),
        style = styleSheet.getStyle('not-defined');

      expect(style).toBeUndefined();
    });

    it('should return a style if one exists', function() {
      var styleSheet = new StyleSheet({p: {color: 'red'}}),
        style = styleSheet.getStyle('p');

      expect(style instanceof CSJS.Style).toBe(true);
    });
  });

  describe('addStyles', function() {
    it('should throw an error if passed invalid style blocks', function() {
      var styleSheet = new StyleSheet(),
        addStyles = styleSheet.addStyles.bind(styleSheet, 123);

      expect(addStyles).toThrow();
    });

    it('should return an empty array if not passed any style blocks', function() {
      var styleSheet = new StyleSheet(),
        styles = styleSheet.addStyles();

      expect(styles).toEqual([]);
    });

    it('should return all declared styles if passed valid style blocks', function() {
      var styleSheet = new StyleSheet(),
        styles = styleSheet.addStyles({
            p: {color: 'green'},
            div: {border: '1px solid black'}
          });

      expect(styles.length).toBe(2);
    });

    it('should return a style object for each valid style if nested styles are present', function() {
      var styleSheet = new StyleSheet(),
        styles = styleSheet.addStyles({
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
        styles = styleSheet.addStyles({
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

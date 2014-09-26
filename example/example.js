var Compiler = CSJS.Compiler;

var mainColor = '#abbccc';
var padding = '10px'

var css = Compiler.jsToCSS({
  p: {
    color: mainColor,
    span: {
      padding: padding
    }
  },
  div: {
    border: '1px solid black',
    ul: {
      li: {
        'list-style': 'none'
      }
    }
  },
  h1: function() {
    return {
      'font-size': '30px',
      'text-decoration': 'underline'
    };
  }
});

console.log(css);

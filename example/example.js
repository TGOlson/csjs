var padding = '10px',
  mainColor = '#1E2FF5';

new CSJS.StyleSheet({
  p: {
    padding: padding,
    color: 'green',
    span: {
      color: mainColor
    }
  },
  div: {
    border: '1px solid ' + mainColor,
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


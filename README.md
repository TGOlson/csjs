# CSJS

Write CSS in JavaScript.

## Usage

```js
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
```

```css
p {
  padding: 10px;
  color: green;
}
p span {
  color: #1E2FF5;
}
div {
  border: 1px solid #1E2FF5;
}
div ul li {
  list-style: none;
}
h1 {
  font-size: 30px;
  text-decoration: underline;
}
```

## Features

Write CSS in JavaScript

## Specs

Install `jasmine-node`

```
$ npm install -g jasmine-node
```

Run the specs

```
$ jasmine-node spec/
```

## TODO

* Add advanced nesting controls (LESS's `&`, etc.)
* Implement `StyleSheet` class
* Implement `Style` class
* Look into an evented interface
* Create some helper functions for creating styles

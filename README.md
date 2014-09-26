# CSJS

Write CSS in JavaScript.

## Usage

```js
var mainColor = '#abbccc',
  padding = '10px';

new CSJS.StyleSheet({
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
```

```css
p {
  color: #abbccc;
}
p span {
  padding: 10px;
}
div {
  border: 1px solid black;
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

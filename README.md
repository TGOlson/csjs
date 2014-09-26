# CSJS

Write CSS in JavaScript.

## Usage

```js
new CSJS.StyleSheet({
  h1: {
    color: 'red',
    padding: '5px',
    border: '1px solid black'
  },
  '.header': {
    'font-size': '20px'
  },
  '#custom-subtext': {
    'text-decoration': 'underline'
  },
  li: {
    'list-style': 'none',
    'background-color': 'green'
  }
});
```

```css
h1 {
  color: red;
  padding: 5px;
  border: 1px solid black;
}

.header {
  font-size: 20px;
}

#custom-subtext {
  text-decoration: underline;
}

li {
  list-style: none;
  background-color: green;
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


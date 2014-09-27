# CSJS

Write CSS in JavaScript.

## Features

Write all your styles in JavaScript. This allows to functionality that even LESS and SASS can't accomplish, while retaining all the benefits they do offer.

* Pass around references  to style objects.
* Dynamically modify styles.
* Defining style values with variables, loops or with functions.
* Subscribe to style-change events.
* Dynamically minify styles.

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

* Programmatically add styles

```js
var styleSheet = CSJS.getStyleSheet('main');

styleSheet.addStyle('p', {color: 'purple'});
// => [object Style]
```

The current style-sheet will now include the defined style `p {color: purple;}`.

* Edit previous styles

```js
styleSheet.updateStyle('p', {color: 'green'});
// => [object Style]
```

Now the original style is updated `p {color: green;}`.

* Interact with style objects

```js
var style = styleSheet.getStyle('p');

style.toCSS();
// "p {
//   color: green;
// }"

style.update({'background-color:' 'yellow'});
// => [object Style]

style.toCSS();
// "p {
//   color: green;
//   background-color: yellow;
// }"

style.getValue('color');
// => 'green'
```

**note: using `style.getValue` will not work for styles with values that are defined as functions. This is because functional declarations and values are evaluated at compile time.

```js
var style = styleSheet.addStyle('p', function() {
    return {color: 'green'};
  });

style.get('color');
// => undefined
```

* Auto-compilation

The above examples work by leveraging auto compilation. However, if this is undesirable, it can be toggled off by setting the global `autoCompile` variable:

```js
// define auto-compilation for all style-sheets
// the below will stop style-sheets from auto-comiling
CSJS.autoCompile = false;
```

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
* Look into an evented interface
* Create some helper functions for creating styles
* Look into bugs with adding declarations to style with preexisting functional declarations.

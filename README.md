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

## Compilation

All style compilation is done by the `CSJS.Compiler`. This engine is used to convert style blocks to css, such as those found on `CSJS.Style` objects, or it can be used for live css compilation using the `Compiler.compile` method.

* Compilation Profiles

Compilations were Profiled using 5000 default blocks, each with 5 unique styles and 4 levels.

```js
// default test block
{
  color: 'blue',
  padding: '5px',
  div: {color: 'red'},
  ul: {
    li: {
      span: {
        border: '1px solid #aaa',
        color: 'blue'
      }
    }
  }
};
```

Character count:

491,670 minified
636,669 un-minified

**(these character counts mirror what one might expect from *very* large scale production apps)**

Compiling all 5,000 style blocks at once:
```
Live compiling 5000 style blocks.
Duration: 288ms

Initializing style-sheet with 5000 style blocks.
Duration: 469ms

Re-compiling style-sheet with 5000 style blocks.
Duration: 154ms
```

Note, at this block size, compilation speeds start to drag. A smarter technique would be to split the styles into smaller style sheets.

Compiling 10 sets of 500 style blocks:
```
Live compiling 10 sets of 500 style blocks.
Duration: 139ms

Initializing 10 style-sheets with 500 style blocks each.
Duration: 144ms

Re-compiling 10 style-sheets with 500 style blocks each.
Duration: 25ms
```

And even better - 50 style-sheets of 100 style blocks each (close to how traditional style-sheets may be structured)

Compiling 50 sets of 100 style blocks:
```
Live compiling 50 sets of 100 style blocks.
Duration: 111ms

Initializing 50 style-sheets with 100 style blocks each.
Duration: 116ms

Re-compiling 50 style-sheets with 100 style blocks each.
Duration: 12ms
```

Note how recompiling becomes almost instant once style blocks are spread between multiple style-sheets. Using this technique, a huge production app could initialize all their style-sheets on page load in just over 100ms, and recompile every style sheet with updates in just over 10ms.

Another benefit of creating multiple style-sheets is that generally only one style-sheet will need to be recompiled at any given time. Re-compiling a single style-sheet of 100 style blocks takes less than 1ms. (in this test, 100 style blocks define 500 unique CSS styles - roughly 9,270 characters minified)

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

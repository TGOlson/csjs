# CSJS

Write CSS in JavaScript.

### Features

Write all your styles in JavaScript. This allows functionality that even LESS and SASS can't accomplish, while retaining all the benefits they do offer.

* Pass around references to style objects.
* Dynamically modify styles.
* Define style values with variables, loops or with functions.
* Subscribe to style-change events.
* Dynamically minify and compile styles.

### Usage

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
var styleSheet = new CSJS.StyleSheet();

styleSheet.add('p', {color: 'purple'});
// => [object Style]
```

The current style-sheet will now include the defined style `p {color: purple;}`.

* Edit previous styles

```js
styleSheet.update('p', {color: 'green'});
// => [object Style]
```

Now the original style is updated `p {color: green;}`.

* Interact with style objects

```js
var style = styleSheet.get('p');

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

style.get('color');
// => 'green'
```

* Auto-compilation

The above examples work by leveraging auto compilation. However, if this is undesirable, it can be toggled off by setting the global `autoCompile` variable:

```js
// define auto-compilation for all style-sheets
// the below will stop style-sheets from auto-compiling
CSJS.autoCompile = false;
```

### Compilation

All style compilation is done by the `CSJS.Compiler`. This engine is used to convert style blocks to css, such as those found on `CSJS.Style` objects, or it can be used for live css compilation using the `Compiler.compile` method.

* Compilation Profiles

Run profiles

```
$ node profiles/
```

Compilations were profiled using 5000 default blocks, each with 5 unique styles and 4 levels.

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

* These character counts mirror what one might expect from a *very* large scale production app
* Bootstrap is a little over 100,000 characters minified


Compiling all 5,000 style blocks at once:
```
Live compiling 1 set of 5000 style blocks.
Duration: 288ms

Initializing 1 style-sheet with 5000 style blocks each.
Duration: 448ms

Recompiling 1 style-sheet with 5000 style blocks each.
Duration: 149ms
```

Note, at this block size, compilation speeds start to drag. A smarter technique would be to split the styles into smaller style sheets.

Compiling 10 sets of 500 style blocks:
```
Live compiling 10 sets of 500 style blocks.
Duration: 144ms

Initializing 10 style-sheets with 500 style blocks each.
Duration: 160ms

Recompiling 10 style-sheets with 500 style blocks each.
Duration: 18ms
```

And even better - 50 style-sheets of 100 style blocks each (close to how traditional style-sheets may be structured)

Compiling 50 sets of 100 style blocks:
```
Live compiling 50 sets of 100 style blocks.
Duration: 117ms

Initializing 50 style-sheets with 100 style blocks each.
Duration: 133ms

Recompiling 50 style-sheets with 100 style blocks each.
Duration: 7ms
```

Note how recompiling becomes almost instant once style blocks are spread between multiple style-sheets. Using this technique, a huge production app could initialize all their style-sheets on page load in just over 100ms, and recompile every style sheet with updates in well under 10ms.

Another benefit of creating multiple style-sheets is that generally only one style-sheet will need to be recompiled at any given time. Recompiling a single style-sheet of 100 style blocks takes less than 1ms. (in this test, 100 style blocks define 500 unique CSS styles - roughly 9,270 characters minified)

### Specs

Install `jasmine-node`

```
$ npm install -g jasmine-node
```

Run the specs

```
$ jasmine-node spec/
```

### TODO

* Add advanced nesting controls (LESS's `&`, etc.)
* Look into an evented interface
* Create some helper functions for creating styles
* Look into bugs with adding declarations to style with preexisting functional declarations.
* Refactor compiler so no pre-processing is necessary (much faster)

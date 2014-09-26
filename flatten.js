// delimter to join flattened keys
var delimiter = ' '

/*
 * Flattens an object
 * @param {object} object - object to flatten
 * @param {boolean} shallow - if true object is only flattened one level
 * @return {object} - flattened object
 */
function flatten(object, shallow) {
  var flattened = {},
    property,
    value,
    nextLevel,
    prefix;

  for(property in object) {
    value = object[property];

    if(typeof value === 'object' && shallow !== null && value !== null) {

      // if shallow is required, set shallow to stopping keyword null
      if(shallow) shallow = null;

      nextLevel = flatten(value, shallow);
      prefix = property + delimiter;

      merge(flattened, nextLevel, prefix);

    } else {
      flattened[property] = value;
    }
  }

  return flattened;
}

/*
 * Destructively merges source data to an object
 * @param {object} object - object to merge data into
 * @param {object} source - object of source data
 * @param {string} prefix - [optional] prefix properties with value
 */
function merge(object, source, prefix) {
  var merged = {},
    property,
    value;

  prefix = prefix || '';

  for(property in source) {
    value = source[property];

    object[prefix + property] = value;
  }

  return object;
}

// function unflatten(object, level) {
//   var unflattened = {},
//     property,
//     value;

//   for(property in object) {
//     value = object[property];

//     var propertySegments = property.split(delimiter);
//     var next = propertySegments.pop();
//     var remaining = propertySegments.join(delimiter);

//     if(remaining.length) {
//       unflattened[remaining] = unflattened[remaining] || {};
//       unflattened[remaining][next] = value;
//     } else {
//       unflattened[next] = value;
//     }


//   }

//   return unflattened;
// }

// level 1
// var object = {1: 2};

// var object = {1: {2: 3}};
var object = {
  1: {
    2: 3,
    4: {5: 6},
    7: {8: 9, 10: 11}
  },
  12: 13
};

// var object = {
//   1: {
//     2: null,
//     3: ['a', 'b', 'c'],
//   },
// };

var flattened = flatten(object, true);

console.log(flattened);

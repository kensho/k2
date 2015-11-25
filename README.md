# K2

> Functional javascript utilities

[![NPM][k2-icon] ][k2-url]

[![manpm](https://img.shields.io/badge/manpm-%E2%9C%93-3399ff.svg)](https://github.com/bahmutov/manpm)
[![Circle CI](https://circleci.com/gh/kensho/k2.svg?style=svg)](https://circleci.com/gh/kensho/k2)
[![Code Climate](https://codeclimate.com/github/kensho/k2/badges/gpa.svg)](https://codeclimate.com/github/kensho/k2)

[k2-icon]: https://nodei.co/npm/k2.png?downloads=true
[k2-url]: https://npmjs.org/package/k2

## Install

    npm install --save k2

In the browser, if you already have global [lodash](https://lodash.com/docs) library, you can
include `dist/k2-browser.js`. Under Node, or to use lodash included in the k2 bundle, use `dist/k2.js`.

```js
// node
var k2 = require('k2');
```

## Api

### presentProperties

Determines if each property in the list is present in each object given in the second list

```js
var bad = [{
  name: 'foo',
  age: 1
}, {
  name: 'bar'
}, {
  name: 'baz'
}];
presentProperties(['name', 'age'], bad);
// ['name']
```

`presentProperties` is curried, works with deep properties, requires `lodash` version
with deep property support, see [_.has](https://lodash.com/docs#has)

### cleanEnteredText

Removes HTML entities from user-entered text. Common entities introduced by a textarea element
are `&nbsp;` at the end.

```js
var cleanText = k2.cleanEnteredText(text);
// text - string entered into a textarea
```

```js
k2.cleanEnteredText('FOO&nbsp;b') // 'foo b'
k2.cleanEnteredText('foo&nbsp;') // 'foo'
```

In addition to `cleanEnteredText`, there is also `cleanHtmlTags` and `cleanTickerSearchHtml`

### findPartialMatches

Finds all items where given properties are matching the given query text.

```js
var matches = k2.findPartialMatches(properties, items, queryText);
// properties - single string or an array of strings
// items - objects to search over
// queryText - single string
```

```js
// find all items where property 'foo' contains 'ooo'
var items = [{
  foo: 'foo'
}, {
  foo: 'foo2'
}, {
  foo: 'bar'
}];
var result = k2.findPartialMatches('foo', items, 'oo');
// result is [ items[0], items[1] ]
```

### rankPartialMatches

Useful to order items by text entered by the user, but only considering matches of query text to
certain properties. Items without any matches will be pushed to the back of the returned list.

```js
var matches = k2.rankPartialMatches(properties, matches, queryText);
// properties - single string or array of strings
// matches - objects to search
// queryText - single string
```

```js
var items = [{
    foo: 'foo'
}, {
    foo: 'foo2',
    bar: 'abar'
}, {
    foo: 'bar'
}];
var result = k2.rankPartialMatches(['foo', 'bar'], items, 'bar');
// result is a new array with 3 items
// result[0] is items[2] (exact match)
// result[1] is items[1] (partial match)
// result[2] is items[0] (nothing matches)
```

### objectLens

A function for building immutable object lenses. Construct the lens with a key
and then use its getter, setter, or mapper.

```js
objectLens('name')({ name: 'joe' });
// => 'joe'
objectLens('age').set(20, { age: 19 });
// => { age: 20 }
objectLens('age').map(R.add(1), { age: 19 });
// => { age: 20 }
```

To compose setters, use function composition!

```js
var setter = R.compose(objectLens('name').set('matt'),
  objectLens('age').map(R.add(1)));
setter({ name: 'joe', age: 19 })
// => { name: 'matt', age: 20 }
```

### onlyTrue

XOR for predicates - returns true if and only if a single value is truthy.

```js
onlyTrue(true, false, false); // true
onlyTrue(false, false, false); // false
onlyTrue(false, true, true); // false
onlyTrue(false, false, true); // true
```

### guessDateFormat

Tries to determine date format from single or list of strings. If there is ambiguity returns undefined.

```js
guessDateFormat('2010-15-10'); // 'YYYY-DD-MM'
guessDateFormat(['05/19/2000', '22/01/2002']); // undefined
```

### fanout

Apply a collection of functions to the same input and collect their results in
a list.

```js
fanout(prop(0), prop(1))(['a', 'b']) == ['a', 'b']
fanout(length)(['a', 'b']) == [2]
```

### Small print

Author: Kensho &copy; 2015

* [@kensho](https://twitter.com/kensho)
* [kensho.com](http://kensho.com)

Support: if you find any problems with this library,
[open issue](https://github.com/kensho/k2/issues) on Github

## MIT License

The MIT License (MIT)

Copyright (c) 2015 Kensho

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


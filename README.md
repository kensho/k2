# K2

> Functional javascript utilities

[![NPM][k2-icon] ][k2-url]

[![Circle CI](https://circleci.com/gh/kensho/k2.svg?style=svg)](https://circleci.com/gh/kensho/k2)
[![Code Climate](https://codeclimate.com/github/kensho/k2/badges/gpa.svg)](https://codeclimate.com/github/kensho/k2)

[k2-icon]: https://nodei.co/npm/k2.png?downloads=true
[k2-url]: https://npmjs.org/package/k2

## Api

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


/* global describe, it */
require('lazy-ass');
var R = require('ramda');
var objectLens = require('./immutable-objects.es6');

describe('immutable objects', function () {
  it('gets object value for key', function () {
    var o = { name: 'joe' };
    la(o.name === objectLens('name')(o));
  });

  it('immutably sets object value for key', function () {
    var o = { name: 'joe', age: 20 };
    var updated = objectLens('age').set(21, o);
    la(o.age === 20);
    la(updated.age === 21 &&
       updated.name === o.name);
  });

  it('immutably maps value by function', function () {
    var o = { name: 'joe', age: 20 };
    var updated = objectLens('age').map(R.add(1), o);
    la(o !== updated && o.age === 20);
    la(updated.age === o.age + 1 &&
       updated.name === o.name);
  });

  it('lenses are chainable', function () {
    var o = { name: 'joe', age: 20 };
    var updated = R.compose(objectLens('name').set('matt'),
      objectLens('age').map(R.add(1)))(o);
    la(updated.name === 'matt' && updated.age === 21);
  });
});


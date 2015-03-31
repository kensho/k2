/* global describe, it */
require('lazy-ass');
var check = require('check-more-types');
var _ = require('lodash');

describe('partial matching', function () {
  var findPartialMatches = require('./find-partial-matches.es6');

  it('is a function', function () {
    la(check.fn(findPartialMatches));
  });

  it('returns empty list for empty query', function () {
    la(check.fn(findPartialMatches));
    var result = findPartialMatches('foo', [], '');
    la(_.isEqual(result, []));
  });

  it('selects partial matches', function () {
    var items = [{
      foo: 'foo'
    }, {
      foo: 'foo2'
    }, {
      foo: 'bar'
    }];
    var result = findPartialMatches('foo', items, 'ar');
    la(result.length === 1);
    la(check.same(result[0], items[2]));
  });

  it('selects partial matches', function () {
    var items = [{
      foo: 'foo'
    }, {
      foo: 'foo2'
    }, {
      foo: 'bar'
    }];
    var result = findPartialMatches('foo', items, 'oo');
    la(result.length === 2);
    la(check.same(result[0], items[0]));
    la(check.same(result[1], items[1]));
  });

  describe('findPartialMatches over multiple properties', function () {
    it('selects partial matches', function () {
      var items = [{
        foo: 'foo'
      }, {
        foo: 'foo2',
        bar: 'bar'
      }, {
        foo: 'bar'
      }];
      var result = findPartialMatches(['foo', 'bar'], items, 'ar');
      la(result.length === 2);
      la(check.same(result[0], items[1]));
      la(check.same(result[1], items[2]));
    });

    it('property might be missing', function () {
      var items = [{
        foo: 'foo'
      }, {
        foo: 'foo2',
        bar: 'bar'
      }, {
        foo: 'bar'
      }];
      var result = findPartialMatches(['nothing', 'bar'], items, 'ar');
      la(result.length === 1);
      la(check.same(result[0], items[1]));
    });
  });
});

/* global describe, it */
require('lazy-ass');
var check = require('check-more-types');
var _ = require('lodash');
import rankPartialMatches from './rank-partial-matches.es6';

describe('rankPartialMatches', function () {
  it('is a function', function () {
    la(check.fn(rankPartialMatches));
  });

  describe('over multiple properties', function () {
    it('ranks partial matches', function () {
      var items = [{
        foo: 'foo'
      }, {
        foo: 'foo2',
        bar: 'abar'
      }, {
        foo: 'bar'
      }];
      var result = rankPartialMatches(['foo', 'bar'], items, 'bar');
      la(result !== items, 'returns different array');
      la(result.length === 3, 'every item is ranked');
      la(check.same(result[0], items[2]), 'exact match');
      la(check.same(result[1], items[1]), 'non-exact match');
    });
  });

  describe('over a single property', function () {
    it('returns empty list for empty items', function () {
      var items = [];
      var result = rankPartialMatches('foo', items, 'boo');
      la(_.isEqual(result, []));
      la(check.not.same(result, items));
    });

    it('returns empty list for empty query', function () {
      var items = [{
        foo: 'foo'
      }];
      var result = rankPartialMatches('foo', items, '');
      la(_.isEqual(result, []));
      la(check.not.same(result, items));
    });

    it('exact match is better than partial matches', function () {
      var items = [{
        foo: 'foo2'
      }, {
        foo: 'foo'
      }];
      var result = rankPartialMatches('foo', items, 'foo');
      la(check.array(result), 'returns an array');
      la(result !== items, 'returned result is different from input');
      la(result.length === items.length);
      la(check.same(result[0], items[1]), 'exact match first');
      la(check.same(result[1], items[0]), 'partial match second');
    });

    it('matches are ordered from start', function () {
      var items = [{
        foo: 'abfoo'
      }, {
        foo: 'foo'
      }, {
        foo: 'bfoo'
      }];
      var property = 'foo';
      var searchText = 'foo';
      var result = rankPartialMatches(property, items, searchText);
      la(result.length === items.length);
      la(check.same(result[0], items[1]), 'exact match first');
      la(check.same(result[1], items[2]), 'closer from start match first');
      la(check.same(result[2], items[0]));
    });

    it('puts all non-found matches at the end', function () {
      var items = [{
        foo: 'abfoo'
      }, {
        foo: 'bar' // does not match search text
      }, {
        foo: 'bfoo'
      }];
      var property = 'foo';
      var searchText = 'foo';
      var result = rankPartialMatches(property, items, searchText);
      la(result.length === items.length);
      la(result[0] === items[2]);
      la(result[1] === items[0]);
      la(result[2] === items[1], 'does not have search text');
    });
  });
});

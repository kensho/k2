/* global describe, beforeEach, it */
require('lazy-ass');
var check = require('check-more-types');
var _ = require('lodash');

describe('partial matching', function () {
  var matching = require('./partial-matching');
  var findPartialMatches, rankPartialMatches;

  beforeEach('has methods for matching', function () {
    la(check.object(matching));
    la(check.fn(matching.findPartialMatches));
    la(check.fn(matching.rankPartialMatches));

    findPartialMatches = matching.findPartialMatches;
    rankPartialMatches = matching.rankPartialMatches;
  });

  describe('findPartialMatches', function () {
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

    describe('over single property', function () {
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

});

/* global describe, beforeEach, it */
require('lazy-ass');
var check = require('check-more-types');

describe('partial matching', function () {
  var matching = require('./partial-matching');

  it('has methods for matching', function () {
    la(check.object(matching));
    la(check.fn(matching.findPartialMatches));
    la(check.fn(matching.rankPartialMatches));
  });

});

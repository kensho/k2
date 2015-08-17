/* global describe, it */
require('lazy-ass');
var check = require('check-more-types');

import fanout from './fanout.es6';

describe('fanout', function () {

  it('is a function', function () {
    la(check.fn(fanout), 'missing fanout');
  });

  it('works on the base case', function () {
    var res = fanout()(1);
    la(res.length === 0, 'fanout base case fails', res);
  });

  it('works on the final element', function () {
    la(fanout(function (x) {
      return x + 1;
    })(1)[0] === 2, 'fanout fails when provided with a function');
  });

});


/* global describe, helpDescribe, beforeEach, it */
require('lazy-ass');
require('lazy-ass-helpful');
require('lazy-ass-helpful/lazy-ass-helpful-bdd.js');

helpDescribe('escaping entered HTML chars for search', function () {
  var _ = require('lodash');
  it('uses _', function () {
    la(_.unescape('foo &amp; bar') === 'foo & bar');
  });

  it('_ does not escape non breaking space', function () {
    la(_.unescape('foo &nbsp; bar') === 'foo &nbsp; bar');
  });
});

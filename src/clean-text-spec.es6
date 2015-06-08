/* global describe, it */
require('lazy-ass');
var check = require('check-more-types');

import clean from './clean-text.es6';
la(check.fn(clean), 'missing clean function', clean);

describe('cleanEnteredSearchText', function () {

  it('removes non breaking space', function () {
    var result = clean('foo&nbsp;b');
    la(result === 'foo b');
  });

  /** @sample _.cleanEnteredSearchText */
  it('restores &', function () {
    la(clean('FOO&nbsp;b') === 'foo b');
    la(clean('foo&amp;bar') === 'foo&bar');
  });

  it('trims spaces on the ends after conversion', function () {
    la(clean('foo&nbsp;') === 'foo');
    la(clean('&nbsp;foo') === 'foo');
  });
});

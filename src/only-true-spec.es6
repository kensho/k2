/* global describe, it */
require('lazy-ass');
import onlyTrue from './only-true.es6';

describe('only-true', () => {
  it('handles single value', () => {
    la(onlyTrue(true));
    la(!onlyTrue(false), 'false');
  });

  it('handles several values positive', () => {
    la(onlyTrue(true, false));
    la(onlyTrue(true, false, false));
    la(onlyTrue(false, true, false, false));
  });

  it('returns false if multiple true', () => {
    la(!onlyTrue(true, true));
    la(!onlyTrue(true, false, false, true));
    la(!onlyTrue(false, true, false, false, true));
  });
});

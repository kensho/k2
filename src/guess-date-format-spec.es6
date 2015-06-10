/* global describe, it */
require('lazy-ass');
var check = require('check-more-types');
import guess from './guess-date-format.es6';

describe('guess-date-format', function () {
  it('is a function', () => {
    la(check.fn(guess));
  });

  it('returns format string', function () {
    var result = guess('2010-02-20');
    la(check.unemptyString(result), 'returns a string', result);
    la(result === 'YYYY-MM-DD', 'correct result', result);
  });

  it('detects YYYY-DD-MM', function () {
    var result = guess('2010-15-10');
    la(result === 'YYYY-DD-MM', 'correct result', result);
  });

  it('detects DD-MM-YYYY', function () {
    var result = guess('15-10-1980');
    la(result === 'DD-MM-YYYY', 'correct result', result);
  });

  it('detects ambiguous format', function () {
    var result = guess('2010-02-10');
    la(!result, 'the date is ambiguous', result);
  });

  it('can use one date to infer others', () => {
    let strings = ['2010-02-15', '2000-02-01', '2000-02-05'];
    const result = guess(strings);
    la(result === 'YYYY-MM-DD', result);
  });

  it('can use one date to infer others', () => {
    let strings = ['10-02-1980', '22-01-1980', '01-01-1980'];
    const result = guess(strings);
    la(result === 'DD-MM-YYYY', result);
  });

  it('can detect contradictory dates', () => {
    let strings = ['2010-02-15', '2000-20-01', '2000-02-05'];
    const result = guess(strings);
    la(!result, result);
  });

  it('detects single digit month', () => {
    let str = '20-2-1980';
    const result = guess(str);
    la(result === 'DD-MM-YYYY', result);
  });

  it('cannot detect single digit day (ambiguous)', () => {
    let str = '2-12-1980';
    const result = guess(str);
    la(!result, result);
  });

});

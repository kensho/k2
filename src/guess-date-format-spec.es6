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

  describe('single date string', function () {
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

    it('detects MM/DD/YYYY', function () {
      const str = '10/20/1900';
      const result = guess(str);
      la(result === 'MM-DD-YYYY', result, str);
    });

    it('detects MM-DD-YYYY', function () {
      const str = '10-20-1900';
      const result = guess(str);
      la(result === 'MM-DD-YYYY', result, str);
    });

    it('handles forward slashes', () => {
      const str = '21/02/2000';
      const result = guess(str);
      la(result === 'DD-MM-YYYY', result, 'from', str);
    });
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

  it('cannot determine format sometimes', () => {
    const strings = ['01/05/2000', '02/05/2000', '02/06/2000', '08/10/2001'];
    const result = guess(strings);
    la(!result, 'could not find format', result);
  });

  it('handles ambiguous dates', () => {
    const strings = ['05/19/2000', '04/06/2001', '22/01/2002',
      '17/01/2003', '02/17/2004'];
    const result = guess(strings);
    la(!result, 'ambiguous', strings, result);
  });

  it('correctly finds date format', function () {
    const strings = ['05/19/2000', '04/06/2001'];
    const result = guess(strings);
    la(result === 'MM-DD-YYYY', strings, result);
  });

  it('handles short 1 digit month', () => {
    const strings = ['05/29/2014', '06/5/2014', '06/12/2014', '06/19/2014'];
    const result = guess(strings);
    la(result === 'MM-DD-YYYY');
  });

  it('another example of ambiguous dates', () => {
    const strings = ['22/01/2003', '10/03/2001'];
    const result = guess(strings);
    la(result === 'DD-MM-YYYY');
  });

});

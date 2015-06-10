require('lazy-ass');
const check = require('check-more-types');

const isYear = (x) => {
  return check.number(x) &&
    x > 0;
}

const isMonth = (x) => {
  return check.number(x) &&
    x > 0 && x < 13;
}

const isDay = (x) => {
  return check.number(x) &&
    x > 0 &&
    x < 32;
}

const validYearMonthDay = (y, m, d) => {
  return isYear(y) &&
    isMonth(m) &&
    isDay(d);
}

const isFormat = (regex, str) => {
  la(check.instance(regex, RegExp), 'expected regular expression', regex);
  la(check.string(str), 'expected string', str);
  return regex.test(str);
};

const isYYYYMMDD = (str) => {
  const ymd = /^(\d\d\d\d)\-(\d\d)\-(\d\d)$/;
  const initial = check.unemptyString(str) &&
    isFormat(ymd, str);
  if (!initial) {
    return false;
  }
  const matches = ymd.exec(str);
  const year = parseInt(matches[1]);
  const month = parseInt(matches[2]);
  const day = parseInt(matches[3]);
  // console.log('year %d month %d day %d', year, month, day);
  return validYearMonthDay(year, month, day);
}

const isYYYYDDMM = (str) => {
  const ymd = /^(\d\d\d\d)\-(\d\d)\-(\d\d)$/;
  const initial = check.unemptyString(str) &&
    isFormat(ymd, str);
  if (!initial) {
    return false;
  }
  const matches = ymd.exec(str);
  const year = parseInt(matches[1]);
  const month = parseInt(matches[3]);
  const day = parseInt(matches[2]);
  // console.log('year %d month %d day %d', year, month, day);
  return validYearMonthDay(year, month, day);
}

const isDDMMYYYY = (str) => {
  const ymd = /^(\d\d)\-(\d\d)-(\d\d\d\d)$/;
  const initial = check.unemptyString(str) &&
    isFormat(ymd, str);
  if (!initial) {
    return false;
  }
  const matches = ymd.exec(str);
  const year = parseInt(matches[3]);
  const month = parseInt(matches[2]);
  const day = parseInt(matches[1]);
  // console.log('year %d month %d day %d', year, month, day);
  return validYearMonthDay(year, month, day);
}

function guessDateFormat(strings) {
  if (check.string(strings)) {
    strings = [strings];
  }
  var allYmd = strings.every(isYYYYMMDD);
  var allYdm = strings.every(isYYYYDDMM);
  var allDmy = strings.every(isDDMMYYYY);

  if (allYmd && !allYdm && !allDmy) {
    return 'YYYY-MM-DD';
  }

  if (!allYmd && allYdm && !allDmy) {
    return 'YYYY-DD-MM';
  }

  if (!allYmd && !allYdm && allDmy) {
    return 'DD-MM-YYYY';
  }
}

export default guessDateFormat;

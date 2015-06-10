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
  la(check.number(y) && check.number(m) && check.number(d),
    'invalid year or month or day', y, m, d);
  return isYear(y) &&
    isMonth(m) &&
    isDay(d);
}

const isFormat = (regex, str) => {
  la(check.instance(regex, RegExp), 'expected regular expression', regex);
  la(check.string(str), 'expected string', str);
  return regex.test(str);
};

const validIndices = check.schema.bind(null, {
  year: check.number,
  month: check.number,
  day: check.number
});

const parseString = (regex, indices, str) => {
  la(check.instance(regex, RegExp));
  la(check.object(indices) && validIndices(indices),
    'missing indices', indices);
  la(check.string(str), 'missing date string', str);
  const initial = check.unemptyString(str) &&
    isFormat(regex, str);
  if (!initial) {
    return;
  }
  const matches = regex.exec(str);
  return {
    year: parseInt(matches[indices.year]),
    month: parseInt(matches[indices.month]),
    day: parseInt(matches[indices.day])
  };
}

const parseIfPossible = (regex, indices, str) => {
  var date = parseString(regex, indices, str);
  if (date) {
    la(validIndices(date), 'missing date fields', date);
    return validYearMonthDay(date.year, date.month, date.day);
  }
}

const isYYYYMMDD = parseIfPossible.bind(null,
  /^(\d\d\d\d)\-(\d\d)\-(\d\d)$/, {
    year: 1,
    month: 2,
    day: 3
  });

const isYYYYDDMM = parseIfPossible.bind(null,
  /^(\d\d\d\d)\-(\d\d)\-(\d\d)$/, {
    year: 1,
    month: 3,
    day: 2
  });

const isDDMMYYYY = parseIfPossible.bind(null,
  /^(\d\d)\-(\d\d?)-(\d\d\d\d)$/, {
    year: 3,
    month: 2,
    day: 1
  });

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

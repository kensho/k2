require('lazy-ass');
const check = require('check-more-types');

function isYear(x) {
  return check.number(x) &&
    x > 0;
}

function isMonth(x) {
  return check.number(x) &&
    x > 0 && x < 13;
}

function isDay(x) {
  return check.number(x) &&
    x > 0 &&
    x < 32;
}

function validYearMonthDay(y, m, d) {
  la(check.number(y) && check.number(m) && check.number(d),
    'invalid year or month or day', y, m, d);
  return isYear(y) &&
    isMonth(m) &&
    isDay(d);
}

function isFormat(regex, str) {
  la(check.instance(regex, RegExp), 'expected regular expression', regex);
  la(check.string(str), 'expected string', str);
  return regex.test(str);
}

const validIndices = check.schema.bind(null, {
  year: check.number,
  month: check.number,
  day: check.number
});

function parseString(regex, indices, str) {
  la(check.instance(regex, RegExp));
  la(check.object(indices) && validIndices(indices),
    'missing indices', indices);
  la(check.string(str), 'missing date string', str);
  const initial = check.unemptyString(str) &&
    isFormat(regex, str);
  if (!initial) {
    /* eslint consistent-return:0 */
    return;
  }
  const matches = regex.exec(str);
  return {
    year: parseInt(matches[indices.year], 10),
    month: parseInt(matches[indices.month], 10),
    day: parseInt(matches[indices.day], 10)
  };
}

function parseIfPossible(regex, indices, str) {
  var date = parseString(regex, indices, str);
  if (date) {
    la(validIndices(date), 'missing date fields', date);
    return validYearMonthDay(date.year, date.month, date.day);
  }
}

const isYYYYMMDD = parseIfPossible.bind(null,
  /^(\d\d\d\d)[\-|\/](\d\d)\-(\d\d)$/, {
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
  /^(\d\d)[-|\/](\d\d?)[-|\/](\d\d\d\d)$/, {
    year: 3,
    month: 2,
    day: 1
  });

const isMMDDYYYY = parseIfPossible.bind(null,
  /^(\d\d)[-|\/](\d\d?)[-|\/](\d\d\d\d)$/, {
    day: 2,
    month: 1,
    year: 3
  });

function lift(fn) {
  return function lifted(arr) {
    return Array.isArray(arr) ? arr.every(fn) : fn(arr);
  };
}

const formats = {
  'YYYY-MM-DD': lift(isYYYYMMDD),
  'YYYY-DD-MM': lift(isYYYYDDMM),
  'DD-MM-YYYY': lift(isDDMMYYYY),
  'MM-DD-YYYY': lift(isMMDDYYYY)
};

function findMatchedFormats(strings) {
  var matchedFormats = [];
  Object.keys(formats).forEach(function (format) {
    var formatCheck = formats[format];
    la(check.fn(formatCheck), 'expected check function', format, formatCheck);
    if (formatCheck(strings)) {
      matchedFormats.push(format);
    }
  });
  return matchedFormats;
}

function guessDateFormat(strings) {
  if (!arguments.length) {
    return;
  }

  const matchedFormats = findMatchedFormats(strings);
  la(check.array(matchedFormats),
    'expected array result', matchedFormats, strings);

  if (matchedFormats.length !== 1) {
    // no matches or ambiguous dates
    return;
  }

  return matchedFormats[0];
}

export default guessDateFormat;

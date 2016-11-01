/**
 * k2 - Functional javascript utils
 * @version v0.14.1
 */
/*! @generated @nolint */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("_"));
	else if(typeof define === 'function' && define.amd)
		define(["_"], factory);
	else if(typeof exports === 'object')
		exports["k2"] = factory(require("_"));
	else
		root["k2"] = factory(root["_"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_8__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _findPartialMatches = __webpack_require__(1);

	var _findPartialMatches2 = _interopRequireDefault(_findPartialMatches);

	var _rankPartialMatches = __webpack_require__(2);

	var _rankPartialMatches2 = _interopRequireDefault(_rankPartialMatches);

	var _cleanText = __webpack_require__(3);

	var _guessDateFormat = __webpack_require__(4);

	var _guessDateFormat2 = _interopRequireDefault(_guessDateFormat);

	var _onlyTrue = __webpack_require__(5);

	var _onlyTrue2 = _interopRequireDefault(_onlyTrue);

	var _presentProperties = __webpack_require__(6);

	var _presentProperties2 = _interopRequireDefault(_presentProperties);

	var _fanout = __webpack_require__(7);

	var _fanout2 = _interopRequireDefault(_fanout);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  findPartialMatches: _findPartialMatches2.default,
	  rankPartialMatches: _rankPartialMatches2.default,
	  guessDateFormat: _guessDateFormat2.default,
	  onlyTrue: _onlyTrue2.default,
	  presentProperties: _presentProperties2.default,
	  cleanEnteredText: _cleanText.cleanEnteredSearchText,
	  cleanHtmlTags: _cleanText.cleanHtmlTags,
	  cleanTickerSearchHtml: _cleanText.cleanTickerSearchHtml,
	  fanout: _fanout2.default
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	__webpack_require__(9);
	var check = __webpack_require__(10);

	function findPartialMatchesSingleProperty(property, items, queryText) {
	  la(check.unemptyString(property), 'need property name', property);
	  la(check.array(items), 'expected list of items', items);
	  la(check.string(queryText), 'expected query string', queryText);
	  if (!queryText) {
	    return [];
	  }

	  var text = queryText.toLowerCase();
	  function hasQueryText(item) {
	    return item[property].toLowerCase().indexOf(text) !== -1;
	  }

	  return items.filter(hasQueryText);
	}

	function findPartialMatchesMultipleProperties(properties, items, queryText) {
	  if (check.string(properties)) {
	    return findPartialMatchesSingleProperty(properties, items, queryText);
	  }
	  la(check.arrayOfStrings(properties), 'need properties', properties);
	  la(check.array(items), 'expected list of items', items);
	  la(check.string(queryText), 'expected query string', queryText);
	  if (!queryText) {
	    return [];
	  }

	  var text = queryText.toLowerCase();
	  function hasQueryText(item) {
	    return properties.some(function (property) {
	      var value = item[property];
	      if (!value) {
	        return false;
	      }
	      return value.toLowerCase().indexOf(text) !== -1;
	    });
	  }

	  return items.filter(hasQueryText);
	}

	exports.default = findPartialMatchesMultipleProperties;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	__webpack_require__(9);
	var check = __webpack_require__(10);
	var _ = __webpack_require__(8);

	// given objects that match query text, rank them, with better matches first
	function rankPartialMatchesSingleProperty(property, matches, queryText) {
	  la(check.unemptyString(property), 'need property name', property);
	  la(check.array(matches), 'expected list of matches', matches);
	  la(check.string(queryText), 'expected query string', queryText);
	  if (!matches.length || !queryText) {
	    return [];
	  }
	  var text = queryText.toLowerCase();

	  // ranks items, whereby a lower number is a better rank, assumes item
	  // matches the query string.
	  function rankMatch(item) {
	    var NOT_FOUND_RANK = 1e6;
	    var matchText = item[property].toLowerCase();
	    if (matchText === text) {
	      return -1;
	    }
	    var matchStartsAt = matchText.indexOf(text);
	    if (matchStartsAt === -1) {
	      return NOT_FOUND_RANK;
	    }
	    return matchStartsAt;
	  }

	  return _.sortBy(matches, rankMatch);
	}

	function rankPartialMatchesMultipleProperties(properties, matches, queryText) {
	  if (check.string(properties)) {
	    return rankPartialMatchesSingleProperty(properties, matches, queryText);
	  }
	  la(check.arrayOfStrings(properties), 'need properties', properties);
	  la(check.array(matches), 'expected list of matches', matches);
	  la(check.string(queryText), 'expected query string', queryText);
	  if (!matches.length || !queryText) {
	    return [];
	  }
	  var text = queryText.toLowerCase();

	  // ranks items, whereby a lower number is a better rank, assumes item
	  // matches the query string.
	  function rankMatch(property, item) {
	    var NOT_FOUND_RANK = 1e6;
	    var matchText = item[property];
	    if (!matchText) {
	      return NOT_FOUND_RANK;
	    }
	    matchText = matchText.toLowerCase();
	    if (matchText === text) {
	      return -1;
	    }
	    var matchStartsAt = matchText.indexOf(text);
	    if (matchStartsAt === -1) {
	      return NOT_FOUND_RANK;
	    }
	    return matchStartsAt;
	  }

	  // best match over multiple properties is the smallest match
	  function rankMatches(item) {
	    var ranks = properties.map(function (property) {
	      return rankMatch(property, item);
	    });

	    return _.min(ranks);
	  }

	  return _.sortBy(matches, rankMatches);
	}

	exports.default = rankPartialMatchesMultipleProperties;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.cleanEnteredSearchText = cleanEnteredSearchText;
	exports.cleanHtmlTags = cleanHtmlTags;
	exports.cleanTickerSearchHtml = cleanTickerSearchHtml;
	__webpack_require__(9);
	var check = __webpack_require__(10);
	var _ = __webpack_require__(8);

	/**
	Removes HTML entities added by TextArea. Used in ticker search
	@method cleanEnteredSearchText */
	function cleanEnteredSearchText(str) {
	  la(check.string(str), 'expected string to clean', str);
	  str = str.toLowerCase();
	  str = str.replace('&nbsp;', ' ');
	  str = str.trim();
	  str = _.unescape(str);
	  return str;
	}

	var STYLE_TAG = /<style\ ?[\w\W\s]*>[\w\W\s]*<\/style>/g;
	var HTML_TAG_REPLACE_REGEX = /<\/?[a-zA-Z-0-9_\ \(\);,\/:"'%=&\.\$\^\[\]#]*>/g;

	// cleans html tags out of a string
	function cleanHtmlTags(str, replaceWith) {
	  la(check.string(str), 'expected string', str);
	  replaceWith = replaceWith || '';
	  return str.replace(HTML_TAG_REPLACE_REGEX, replaceWith);
	}

	function cleanAttributes(text) {
	  var doubleQuotes = /"[^"]+"/g;
	  return text.replace(doubleQuotes, '""');
	}

	function mergeWhiteSpaces(text) {
	  // replace single no break symbol with space
	  text = text.replace(/\s$/, ' ');
	  text = text.replace(/^\s*/, '');
	  text = text.replace(/\n+/, '\n');
	  return text;
	}

	// cleans whatever user pasted into the HTML ticker search box
	// NOTE: does not trim spaces
	function cleanTickerSearchHtml(html) {
	  la(check.string(html), 'expected string', html);

	  var XML_COMMENT_REGEX = /<!--.*?-->/g;
	  html = html.replace(XML_COMMENT_REGEX, ' ');

	  // remove style tags
	  html = html.replace(STYLE_TAG, ' ');

	  html = cleanAttributes(html);

	  html = html.replace(HTML_TAG_REPLACE_REGEX, '\n');

	  var NON_BREAKING_REGEX = /&nbsp;/g;
	  html = html.replace(NON_BREAKING_REGEX, ' ');

	  var AMPERSAND_REGEX = /&amp;/g;
	  html = html.replace(AMPERSAND_REGEX, '&');

	  html = mergeWhiteSpaces(html);
	  return html;
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	__webpack_require__(9);
	var check = __webpack_require__(10);

	function isYear(x) {
	  return check.number(x) && x > 0;
	}

	function isMonth(x) {
	  return check.number(x) && x > 0 && x < 13;
	}

	function isDay(x) {
	  return check.number(x) && x > 0 && x < 32;
	}

	function validYearMonthDay(y, m, d) {
	  la(check.number(y) && check.number(m) && check.number(d), 'invalid year or month or day', y, m, d);
	  return isYear(y) && isMonth(m) && isDay(d);
	}

	function isFormat(regex, str) {
	  la(check.instance(regex, RegExp), 'expected regular expression', regex);
	  la(check.string(str), 'expected string', str);
	  return regex.test(str);
	}

	var validIndices = check.schema.bind(null, {
	  year: check.number,
	  month: check.number,
	  day: check.number
	});

	function parseString(regex, indices, str) {
	  la(check.instance(regex, RegExp));
	  la(check.object(indices) && validIndices(indices), 'missing indices', indices);
	  la(check.string(str), 'missing date string', str);
	  var initial = check.unemptyString(str) && isFormat(regex, str);
	  if (!initial) {
	    /* eslint consistent-return:0 */
	    return;
	  }
	  var matches = regex.exec(str);
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

	var isYYYYMMDD = parseIfPossible.bind(null, /^(\d\d\d\d)[\-|\/](\d\d)\-(\d\d)$/, {
	  year: 1,
	  month: 2,
	  day: 3
	});

	var isYYYYDDMM = parseIfPossible.bind(null, /^(\d\d\d\d)\-(\d\d)\-(\d\d)$/, {
	  year: 1,
	  month: 3,
	  day: 2
	});

	var isDDMMYYYY = parseIfPossible.bind(null, /^(\d\d)[-|\/](\d\d?)[-|\/](\d\d\d\d)$/, {
	  year: 3,
	  month: 2,
	  day: 1
	});

	var isMMDDYYYY = parseIfPossible.bind(null, /^(\d\d)[-|\/](\d\d?)[-|\/](\d\d\d\d)$/, {
	  day: 2,
	  month: 1,
	  year: 3
	});

	function lift(fn) {
	  return function lifted(arr) {
	    return Array.isArray(arr) ? arr.every(fn) : fn(arr);
	  };
	}

	var formats = {
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

	  var matchedFormats = findMatchedFormats(strings);
	  la(check.array(matchedFormats), 'expected array result', matchedFormats, strings);

	  if (matchedFormats.length !== 1) {
	    // no matches or ambiguous dates
	    return;
	  }

	  return matchedFormats[0];
	}

	exports.default = guessDateFormat;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/*
	  Returns true only if for the given list of predicates,
	  only single one is true, and the rest are false.

	  onlyTrue(true, false, false); // true
	  onlyTrue(false, false, false); // false
	  onlyTrue(false, true, true); // false
	  onlyTrue(false, false, true); // true
	*/
	function onlyTrue() {
	  var predicates = Array.prototype.slice.call(arguments, 0);
	  if (!predicates.length) {
	    return false;
	  }
	  var count = 0,
	      k;
	  for (k = 0; k < predicates.length; k += 1) {
	    if (predicates[k]) {
	      count += 1;
	      if (count > 1) {
	        return false;
	      }
	    }
	  }

	  return count === 1;
	}

	exports.default = onlyTrue;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	__webpack_require__(9);
	var check = __webpack_require__(10);
	var _ = __webpack_require__(8);
	la(check.fn(_.has), 'missing lodash.has method, version upgrade?', _.VERSION);

	function presentProperties(testProperties, list) {
	  la(check.arrayOf(check.unemptyString, testProperties), 'missing test properties', testProperties);
	  la(check.array(list), 'missing list of objects', list);

	  return testProperties.filter(function (key) {
	    return list.every(function (object) {
	      return _.has(object, key);
	    });
	  });
	}

	exports.default = _.curry(presentProperties);

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = fanout;
	function fanout() {
	  for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
	    fns[_key] = arguments[_key];
	  }

	  return function (x) {
	    return fns.map(function (fn) {
	      return fn(x);
	    });
	  };
	}

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_8__;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {(function initLazyAss() {

	  function isArrayLike(a) {
	    return a && typeof a.length === 'number';
	  }

	  function toStringArray(arr) {
	    return 'array with ' + arr.length + ' items.\n[' +
	      arr.map(toString).join(',') + ']\n';
	  }

	  function isPrimitive(arg) {
	    return typeof arg === 'string' ||
	      typeof arg === 'number' ||
	      typeof arg === 'boolean';
	  }

	  function toString(arg, k) {
	    if (isPrimitive(arg)) {
	      return JSON.stringify(arg);
	    }
	    if (arg instanceof Error) {
	      return arg.name + ' ' + arg.message;
	    }

	    if (Array.isArray(arg)) {
	      return toStringArray(arg);
	    }
	    if (isArrayLike(arg)) {
	      return toStringArray(Array.prototype.slice.call(arg, 0));
	    }
	    var argString;
	    try {
	      argString = JSON.stringify(arg, null, 2);
	    } catch (err) {
	      argString = '{ cannot stringify arg ' + k + ', it has type "' + typeof arg + '"';
	      if (typeof arg === 'object') {
	        argString += ' with keys ' + Object.keys(arg).join(', ') + ' }';
	      } else {
	        argString += ' }';
	      }
	    }
	    return argString;
	  }

	  function formMessage(args) {
	    var msg = args.reduce(function (total, arg, k) {
	      if (k) {
	        total += ' ';
	      }
	      if (typeof arg === 'string') {
	        return total + arg;
	      }
	      if (typeof arg === 'function') {
	        var fnResult;
	        try {
	          fnResult = arg();
	        } catch (err) {
	          // ignore the error
	          fnResult = '[function ' + arg.name + ' threw error!]';
	        }
	        return total + fnResult;
	      }
	      var argString = toString(arg, k);
	      return total + argString;
	    }, '');
	    return msg;
	  }

	  function lazyAssLogic(condition) {
	    var fn = typeof condition === 'function' ? condition : null;

	    if (fn) {
	      condition = fn();
	    }
	    if (!condition) {
	      var args = [].slice.call(arguments, 1);
	      if (fn) {
	        args.unshift(fn.toString());
	      }
	      return new Error(formMessage(args));
	    }
	  }

	  var lazyAss = function lazyAss() {
	    var err = lazyAssLogic.apply(null, arguments);
	    if (err) {
	      throw err;
	    }
	  };

	  var lazyAssync = function lazyAssync() {
	    var err = lazyAssLogic.apply(null, arguments);
	    if (err) {
	      setTimeout(function () {
	        throw err;
	      }, 0);
	    }
	  };

	  function register(value, name) {
	    if (typeof window === 'object') {
	      /* global window */
	      window[name] = value;
	    } else if (typeof global === 'object') {
	      global[name] = value;
	    } else {
	      throw new Error('Do not know how to register ' + name);
	    }
	  }

	  register(lazyAss, 'lazyAss');
	  register(lazyAss, 'la');
	  register(lazyAssync, 'lazyAssync');
	  register(lazyAssync, 'lac');

	}());

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {(function checkMoreTypes(check) {
	  'use strict';

	  /**
	    Custom assertions and predicates around https://github.com/philbooth/check-types.js
	    Created by Kensho https://github.com/kensho
	    Copyright @ 2014 Kensho https://www.kensho.com/
	    License: MIT

	    @module check
	  */

	  if (!check) {
	    if (false) {
	      throw new Error('Cannot find check-types library, has it been loaded?');
	    }
	    check = __webpack_require__(11);
	  }

	  if (typeof Function.prototype.bind !== 'function') {
	    throw new Error('Missing Function.prototype.bind, please load es5-shim first');
	  }

	  /**
	    Checks if argument is defined or not

	    This method now is part of the check-types.js
	    @method defined
	  */
	  function defined(value) {
	    return typeof value !== 'undefined';
	  }

	  /**
	    Checks if argument is a valid Date instance

	    @method validDate
	  */
	  function validDate(value) {
	    return check.date(value) &&
	      check.number(Number(value));
	  }

	  /**
	    Returns true if the argument is primitive JavaScript type

	    @method primitive
	  */
	  function primitive(value) {
	    var type = typeof value;
	    return type === 'number' ||
	      type === 'boolean' ||
	      type === 'string';
	  }

	  /**
	    Returns true if the value is a number 0

	    @method zero
	  */
	  function zero(x) {
	    return typeof x === 'number' && x === 0;
	  }

	  /**
	    same as ===

	    @method same
	  */
	  function same(a, b) {
	    return a === b;
	  }

	  /**
	    Returns true if the index is valid for give string / array

	    @method index
	  */
	  function index(list, k) {
	    return defined(list) &&
	      has(list, 'length') &&
	      k >= 0 &&
	      k < list.length;
	  }

	  /**
	    Returns true if both objects are the same type and have same length property

	    @method sameLength
	  */
	  function sameLength(a, b) {
	    return typeof a === typeof b &&
	      a && b &&
	      a.length === b.length;
	  }

	  /**
	    Returns true if all items in an array are the same reference

	    @method allSame
	  */
	  function allSame(arr) {
	    if (!check.array(arr)) {
	      return false;
	    }
	    if (!arr.length) {
	      return true;
	    }
	    var first = arr[0];
	    return arr.every(function (item) {
	      return item === first;
	    });
	  }

	  /**
	    Returns true if given item is in the array

	    @method oneOf
	  */
	  function oneOf(arr, x) {
	    check.verify.array(arr, 'expected an array');
	    return arr.indexOf(x) !== -1;
	  }

	  /**
	    Returns true for urls of the format `git@....git`

	    @method git
	  */
	  function git(url) {
	    return check.unemptyString(url) &&
	      /^git@/.test(url);
	  }

	  /**
	    Checks if given value is 0 or 1

	    @method bit
	  */
	  function bit(value) {
	    return value === 0 || value === 1;
	  }

	  /**
	    Checks if given value is true of false

	    @method bool
	  */
	  function bool(value) {
	    return typeof value === 'boolean';
	  }

	  /**
	    Checks if given object has a property
	    @method has
	  */
	  function has(o, property) {
	    if (arguments.length !== 2) {
	      throw new Error('Expected two arguments to check.has, got only ' + arguments.length);
	    }
	    return Boolean(o && property &&
	      typeof property === 'string' &&
	      typeof o[property] !== 'undefined');
	  }

	  /**
	  Checks if given string is already in lower case
	  @method lowerCase
	  */
	  function lowerCase(str) {
	    return check.string(str) &&
	      str.toLowerCase() === str;
	  }

	  /**
	  Returns true if the argument is an array with at least one value
	  @method unemptyArray
	  */
	  function unemptyArray(a) {
	    return check.array(a) && a.length > 0;
	  }

	  /**
	  Returns true if each item in the array passes the predicate
	  @method arrayOf
	  @param rule Predicate function
	  @param a Array to check
	  */
	  function arrayOf(rule, a) {
	    return check.array(a) && a.every(rule);
	  }

	  /**
	  Returns items from array that do not passes the predicate
	  @method badItems
	  @param rule Predicate function
	  @param a Array with items
	  */
	  function badItems(rule, a) {
	    check.verify.array(a, 'expected array to find bad items');
	    return a.filter(notModifier(rule));
	  }

	  /**
	  Returns true if given array only has strings
	  @method arrayOfStrings
	  @param a Array to check
	  @param checkLowerCase Checks if all strings are lowercase
	  */
	  function arrayOfStrings(a, checkLowerCase) {
	    var v = check.array(a) && a.every(check.string);
	    if (v && check.bool(checkLowerCase) && checkLowerCase) {
	      return a.every(check.lowerCase);
	    }
	    return v;
	  }

	  /**
	  Returns true if given argument is array of arrays of strings
	  @method arrayOfArraysOfStrings
	  @param a Array to check
	  @param checkLowerCase Checks if all strings are lowercase
	  */
	  function arrayOfArraysOfStrings(a, checkLowerCase) {
	    return check.array(a) && a.every(function (arr) {
	      return check.arrayOfStrings(arr, checkLowerCase);
	    });
	  }

	  /**
	    Checks if object passes all rules in predicates.

	    check.all({ foo: 'foo' }, { foo: check.string }, 'wrong object');

	    This is a composition of check.every(check.map ...) calls
	    https://github.com/philbooth/check-types.js#batch-operations

	    @method all
	    @param {object} object object to check
	    @param {object} predicates rules to check. Usually one per property.
	    @public
	    @returns true or false
	  */
	  function all(obj, predicates) {
	    check.verify.object(obj, 'missing object to check');
	    check.verify.object(predicates, 'missing predicates object');
	    Object.keys(predicates).forEach(function (property) {
	      check.verify.fn(predicates[property], 'not a predicate function for ' + property);
	    });
	    return check.every(check.map(obj, predicates));
	  }

	  /**
	    Checks given object against predicates object
	    @method schema
	  */
	  function schema(predicates, obj) {
	    return all(obj, predicates);
	  }

	  /** Checks if given function raises an error

	    @method raises
	  */
	  function raises(fn, errorValidator) {
	    check.verify.fn(fn, 'expected function that raises');
	    try {
	      fn();
	    } catch (err) {
	      if (typeof errorValidator === 'undefined') {
	        return true;
	      }
	      if (typeof errorValidator === 'function') {
	        return errorValidator(err);
	      }
	      return false;
	    }
	    // error has not been raised
	    return false;
	  }

	  /**
	    Returns true if given value is ''
	    @method emptyString
	  */
	  function emptyString(a) {
	    return a === '';
	  }

	  /**
	    Returns true if given value is [], {} or ''
	    @method empty
	  */
	  function empty(a) {
	    var hasLength = typeof a === 'string' ||
	      Array.isArray(a);
	    if (hasLength) {
	      return !a.length;
	    }
	    if (a instanceof Object) {
	      return !Object.keys(a).length;
	    }
	    return false;
	  }

	  /**
	    Returns true if given value has .length and it is not zero, or has properties
	    @method unempty
	  */
	  function unempty(a) {
	    var hasLength = typeof a === 'string' ||
	      Array.isArray(a);
	    if (hasLength) {
	      return a.length;
	    }
	    if (a instanceof Object) {
	      return Object.keys(a).length;
	    }
	    return true;
	  }

	  /**
	    Returns true if 0 <= value <= 1
	    @method unit
	  */
	  function unit(value) {
	    return check.number(value) &&
	      value >= 0.0 && value <= 1.0;
	  }

	  var rgb = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
	  /**
	    Returns true if value is hex RGB between '#000000' and '#FFFFFF'
	    @method hexRgb
	  */
	  function hexRgb(value) {
	    return check.string(value) &&
	      rgb.test(value);
	  }

	  // typical git SHA commit id is 40 digit hex string, like
	  // 3b819803cdf2225ca1338beb17e0c506fdeedefc
	  var shaReg = /^[0-9a-f]{40}$/;

	  /**
	    Returns true if the given string is 40 digit SHA commit id
	    @method commitId
	  */
	  function commitId(id) {
	    return check.string(id) &&
	      id.length === 40 &&
	      shaReg.test(id);
	  }

	  // when using git log --oneline short ids are displayed, first 7 characters
	  var shortShaReg = /^[0-9a-f]{7}$/;

	  /**
	    Returns true if the given string is short 7 character SHA id part
	    @method shortCommitId
	  */
	  function shortCommitId(id) {
	    return check.string(id) &&
	      id.length === 7 &&
	      shortShaReg.test(id);
	  }

	  //
	  // helper methods
	  //

	  if (!check.defend) {
	    var checkPredicates = function checksPredicates(fn, predicates, args) {
	      check.verify.fn(fn, 'expected a function');
	      check.verify.array(predicates, 'expected list of predicates');
	      check.verify.defined(args, 'missing args');

	      var k = 0, // iterates over predicates
	        j = 0, // iterates over arguments
	        n = predicates.length;

	      for (k = 0; k < n; k += 1) {
	        var predicate = predicates[k];
	        if (!check.fn(predicate)) {
	          continue;
	        }

	        if (!predicate.call(null, args[j])) {
	          var msg = 'Argument ' + (j + 1) + ': ' + args[j] + ' does not pass predicate';
	          if (check.unemptyString(predicates[k + 1])) {
	            msg += ': ' + predicates[k + 1];
	          }
	          throw new Error(msg);
	        }

	        j += 1;
	      }
	      return fn.apply(null, args);
	    };

	    check.defend = function defend(fn) {
	      var predicates = Array.prototype.slice.call(arguments, 1);
	      return function () {
	        return checkPredicates(fn, predicates, arguments);
	      };
	    };
	  }

	  /**
	    Combines multiple predicate functions to produce new OR predicate
	    @method or
	  */
	  function or() {
	    var predicates = Array.prototype.slice.call(arguments, 0);
	    if (!predicates.length) {
	      throw new Error('empty list of arguments to or');
	    }

	    return function orCheck() {
	      var values = Array.prototype.slice.call(arguments, 0);
	      return predicates.some(function (predicate) {
	        try {
	          return check.fn(predicate) ?
	            predicate.apply(null, values) : Boolean(predicate);
	        } catch (err) {
	          // treat exceptions as false
	          return false;
	        }
	      });
	    };
	  }

	  /**
	    Combines multiple predicate functions to produce new AND predicate
	    @method or
	  */
	  function and() {
	    var predicates = Array.prototype.slice.call(arguments, 0);
	    if (!predicates.length) {
	      throw new Error('empty list of arguments to or');
	    }

	    return function orCheck() {
	      var values = Array.prototype.slice.call(arguments, 0);
	      return predicates.every(function (predicate) {
	        return check.fn(predicate) ?
	          predicate.apply(null, values) : Boolean(predicate);
	      });
	    };
	  }

	  /**
	  * Public modifier `not`.
	  *
	  * Negates `predicate`.
	  * copied from check-types.js
	  */
	  function notModifier(predicate) {
	    return function () {
	      return !predicate.apply(null, arguments);
	    };
	  }

	  if (!check.mixin) {
	    /** Adds new predicate to all objects
	    @method mixin */
	    check.mixin = function mixin(fn, name) {
	      if (check.string(fn) && check.fn(name)) {
	        var tmp = fn;
	        fn = name;
	        name = tmp;
	      }

	      check.verify.fn(fn, 'expected predicate function');
	      if (!check.unemptyString(name)) {
	        name = fn.name;
	      }
	      check.verify.unemptyString(name, 'predicate function missing name\n' + fn.toString());

	      function registerPredicate(obj, name, fn) {
	        check.verify.object(obj, 'missing object');
	        check.verify.unemptyString(name, 'missing name');
	        check.verify.fn(fn, 'missing function');

	        if (!obj[name]) {
	          obj[name] = fn;
	        }
	      }

	      /**
	       * Public modifier `maybe`.
	       *
	       * Returns `true` if `predicate` is  `null` or `undefined`,
	       * otherwise propagates the return value from `predicate`.
	       * copied from check-types.js
	       */
	      function maybeModifier(predicate) {
	        return function () {
	          if (!check.defined(arguments[0]) || check.nulled(arguments[0])) {
	            return true;
	          }
	          return predicate.apply(null, arguments);
	        };
	      }

	      /**
	       * Public modifier `verify`.
	       *
	       * Throws if `predicate` returns `false`.
	       * copied from check-types.js
	       */
	      function verifyModifier(predicate, defaultMessage) {
	        return function () {
	          var message;
	          if (predicate.apply(null, arguments) === false) {
	            message = arguments[arguments.length - 1];
	            throw new Error(check.unemptyString(message) ? message : defaultMessage);
	          }
	        };
	      }

	      registerPredicate(check, name, fn);
	      registerPredicate(check.maybe, name, maybeModifier(fn));
	      registerPredicate(check.not, name, notModifier(fn));
	      registerPredicate(check.verify, name, verifyModifier(fn, name + ' failed'));
	    };
	  }

	  if (!check.then) {
	    /**
	      Executes given function only if condition is truthy.
	      @method then
	    */
	    check.then = function then(condition, fn) {
	      return function () {
	        var ok = typeof condition === 'function' ?
	          condition.apply(null, arguments) : condition;
	        if (ok) {
	          return fn.apply(null, arguments);
	        }
	      };
	    };
	  }

	  var promiseSchema = {
	    then: check.fn
	  };

	  // work around reserved keywords checks
	  promiseSchema['catch'] = check.fn;
	  promiseSchema['finally'] = check.fn;

	  var hasPromiseApi = schema.bind(null, promiseSchema);

	  /**
	    Returns true if argument implements promise api (.then, .catch, .finally)
	    @method promise
	  */
	  function isPromise(p) {
	    return check.object(p) && hasPromiseApi(p);
	  }

	  /**
	    Shallow strict comparison
	    @method equal
	  */
	  function equal(a, b) {
	    if (arguments.length === 2) {
	      return a === b;
	    } else if (arguments.length === 1) {
	      return function equalTo(b) {
	        return a === b;
	      };
	    } else {
	      throw new Error('Expected at least 1 or 2 arguments to check.equal');
	    }
	  }

	  // new predicates to be added to check object. Use object to preserve names
	  var predicates = {
	    defined: defined,
	    same: same,
	    allSame: allSame,
	    bit: bit,
	    bool: bool,
	    has: has,
	    lowerCase: lowerCase,
	    unemptyArray: unemptyArray,
	    arrayOfStrings: arrayOfStrings,
	    arrayOfArraysOfStrings: arrayOfArraysOfStrings,
	    all: all,
	    schema: schema,
	    raises: raises,
	    empty: empty,
	    emptyString: emptyString,
	    unempty: unempty,
	    unit: unit,
	    hexRgb: hexRgb,
	    sameLength: sameLength,
	    commitId: commitId,
	    shortCommitId: shortCommitId,
	    index: index,
	    git: git,
	    arrayOf: arrayOf,
	    badItems: badItems,
	    oneOf: oneOf,
	    promise: isPromise,
	    validDate: validDate,
	    equal: equal,
	    or: or,
	    and: and,
	    primitive: primitive,
	    zero: zero
	  };

	  Object.keys(predicates).forEach(function (name) {
	    check.mixin(predicates[name], name);
	  });

	  if (true) {
	    module.exports = check;
	  }
	}(typeof window === 'object' ? window.check : global.check));

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * This module exports functions for checking types
	 * and throwing exceptions.
	 */

	/*globals define, module */

	(function (globals) {
	    'use strict';

	    var messages, predicates, functions, verify, maybe, not;

	    predicates = {
	        like: like,
	        instance: instance,
	        emptyObject: emptyObject,
	        nulled: nulled,
	        defined: defined,
	        object: object,
	        length: length,
	        array: array,
	        date: date,
	        fn: fn,
	        webUrl: webUrl,
	        gitUrl: gitUrl,
	        email: email,
	        unemptyString: unemptyString,
	        string: string,
	        evenNumber: evenNumber,
	        oddNumber: oddNumber,
	        positiveNumber: positiveNumber,
	        negativeNumber: negativeNumber,
	        intNumber : intNumber,
	        floatNumber : floatNumber,
	        number: number,
	        bool: bool
	    };

	    messages = {
	        like: 'Invalid type',
	        instance: 'Invalid type',
	        emptyObject: 'Invalid object',
	        nulled: 'Not null',
	        defined: 'Not defined',
	        object: 'Invalid object',
	        length: 'Invalid length',
	        array: 'Invalid array',
	        date: 'Invalid date',
	        fn: 'Invalid function',
	        webUrl: 'Invalid URL',
	        gitUrl: 'Invalid git URL',
	        email: 'Invalid email',
	        unemptyString: 'Invalid string',
	        string: 'Invalid string',
	        evenNumber: 'Invalid number',
	        oddNumber: 'Invalid number',
	        positiveNumber: 'Invalid number',
	        negativeNumber: 'Invalid number',
	        intNumber: 'Invalid number',
	        floatNumber: 'Invalid number',
	        number: 'Invalid number',
	        bool: 'Invalid boolean'
	    };

	    functions = {
	        map: map,
	        every: every,
	        any: any
	    };

	    functions = mixin(functions, predicates);
	    verify = createModifiedPredicates(verifyModifier);
	    maybe = createModifiedPredicates(maybeModifier);
	    not = createModifiedPredicates(notModifier);
	    verify.maybe = createModifiedFunctions(verifyModifier, maybe);
	    verify.not = createModifiedFunctions(verifyModifier, not);

	    exportFunctions(mixin(functions, {
	        verify: verify,
	        maybe: maybe,
	        not: not
	    }));

	    /**
	     * Public function `like`.
	     *
	     * Tests whether an object 'quacks like a duck'.
	     * Returns `true` if the first argument has all of
	     * the properties of the second, archetypal argument
	     * (the 'duck'). Returns `false` otherwise. If either
	     * argument is not an object, an exception is thrown.
	     *
	     * @param thing {object} The object to test.
	     * @param duck {object}  The archetypal object, or
	     *                       'duck', that the test is
	     *                       against.
	     */
	    function like (thing, duck) {
	        var name;

	        verify.object(thing);
	        verify.object(duck);

	        for (name in duck) {
	            if (duck.hasOwnProperty(name)) {
	                if (thing.hasOwnProperty(name) === false || typeof thing[name] !== typeof duck[name]) {
	                    return false;
	                }

	                if (object(thing[name]) && like(thing[name], duck[name]) === false) {
	                    return false;
	                }
	            }
	        }

	        return true;
	    }

	    /**
	     * Public function `instance`.
	     *
	     * Returns `true` if an object is an instance of a prototype,
	     * `false` otherwise.
	     *
	     * @param thing {object}       The object to test.
	     * @param prototype {function} The prototype that the
	     *                             test is against.
	     */
	    function instance (thing, prototype) {
	        if (!defined(thing) || nulled(thing)) {
	            return false;
	        }

	        if (fn(prototype) && thing instanceof prototype) {
	            return true;
	        }

	        return false;
	    }

	    /**
	     * Public function `emptyObject`.
	     *
	     * Returns `true` if something is an empty, non-null,
	     * non-array object, `false` otherwise.
	     *
	     * @param thing          The thing to test.
	     */
	    function emptyObject (thing) {
	        var property;

	        if (object(thing)) {
	            for (property in thing) {
	                if (thing.hasOwnProperty(property)) {
	                    return false;
	                }
	            }

	            return true;
	        }

	        return false;
	    }

	    /**
	     * Public function `nulled`.
	     *
	     * Returns `true` if something is null,
	     * `false` otherwise.
	     *
	     * @param thing The thing to test.
	     */
	    function nulled (thing) {
	        return thing === null;
	    }

	    /**
	     * Public function `defined`.
	     *
	     * Returns `true` if something is not undefined,
	     * `false` otherwise.
	     *
	     * @param thing The thing to test.
	     */
	    function defined (thing) {
	        return thing !== void 0;
	    }

	    /**
	     * Public function `object`.
	     *
	     * Returns `true` if something is a non-null, non-array,
	     * non-date object, `false` otherwise.
	     *
	     * @param thing          The thing to test.
	     */
	    function object (thing) {
	        return typeof thing === 'object' && !nulled(thing) && !array(thing) && !date(thing);
	    }

	    /**
	     * Public function `length`.
	     *
	     * Returns `true` if something is has a length property
	     * that equals `value`, `false` otherwise.
	     *
	     * @param thing The thing to test.
	     * @param value The required length to test against.
	     */
	    function length (thing, value) {
	        return thing && thing.length === value;
	    }

	    /**
	     * Public function `array`.
	     *
	     * Returns `true` something is an array, `false` otherwise.
	     *
	     * @param thing          The thing to test.
	     */
	    function array (thing) {
	        if (Array.isArray) {
	            return Array.isArray(thing);
	        }

	        return Object.prototype.toString.call(thing) === '[object Array]';
	    }

	    /**
	     * Public function `date`.
	     *
	     * Returns `true` something is a date, `false` otherwise.
	     *
	     * @param thing          The thing to test.
	     */
	    function date (thing) {
	        return Object.prototype.toString.call(thing) === '[object Date]';
	    }

	    /**
	     * Public function `fn`.
	     *
	     * Returns `true` if something is function, `false` otherwise.
	     *
	     * @param thing          The thing to test.
	     */
	    function fn (thing) {
	        return typeof thing === 'function';
	    }

	    /**
	     * Public function `webUrl`.
	     *
	     * Returns `true` if something is an HTTP or HTTPS URL,
	     * `false` otherwise.
	     *
	     * @param thing          The thing to test.
	     */
	    function webUrl (thing) {
	        return unemptyString(thing) && /^https?:\/\/.+/.test(thing);
	    }

	    /**
	     * Public function `gitUrl`.
	     *
	     * Returns `true` if something is a git+ssh, git+http or git+https URL,
	     * `false` otherwise.
	     *
	     * @param thing          The thing to test.
	     */
	    function gitUrl (thing) {
	        return unemptyString(thing) && /^git\+(ssh|https?):\/\/.+/.test(thing);
	    }

	    /**
	     * Public function `email`.
	     *
	     * Returns `true` if something seems like a valid email address,
	     * `false` otherwise.
	     *
	     * @param thing          The thing to test.
	     */
	    function email (thing) {
	        return unemptyString(thing) && /\S+@\S+/.test(thing);
	    }

	    /**
	     * Public function `unemptyString`.
	     *
	     * Returns `true` if something is a non-empty string, `false`
	     * otherwise.
	     *
	     * @param thing          The thing to test.
	     */
	    function unemptyString (thing) {
	        return string(thing) && thing !== '';
	    }

	    /**
	     * Public function `string`.
	     *
	     * Returns `true` if something is a string, `false` otherwise.
	     *
	     * @param thing          The thing to test.
	     */
	    function string (thing) {
	        return typeof thing === 'string';
	    }

	    /**
	     * Public function `oddNumber`.
	     *
	     * Returns `true` if something is an odd number,
	     * `false` otherwise.
	     *
	     * @param thing          The thing to test.
	     */
	    function oddNumber (thing) {
	        return number(thing) && (thing % 2 === 1 || thing % 2 === -1);
	    }

	    /**
	     * Public function `evenNumber`.
	     *
	     * Returns `true` if something is an even number,
	     * `false` otherwise.
	     *
	     * @param thing          The thing to test.
	     */
	    function evenNumber (thing) {
	        return number(thing) && thing % 2 === 0;
	    }

	    /**
	     * Public function `intNumber`.
	     *
	     * Returns `true` if something is an integer number,
	     * `false` otherwise.
	     *
	     * @param thing          The thing to test.
	     */
	    function intNumber (thing) {
	        return number(thing) && thing % 1 === 0;
	    }

	    /**
	     * Public function `floatNumber`.
	     *
	     * Returns `true` if something is a float number,
	     * `false` otherwise.
	     *
	     * @param thing          The thing to test.
	     */
	    function floatNumber (thing) {
	        return number(thing) && thing % 1 !== 0;
	    }

	    /**
	     * Public function `positiveNumber`.
	     *
	     * Returns `true` if something is a positive number,
	     * `false` otherwise.
	     *
	     * @param thing          The thing to test.
	     */
	    function positiveNumber (thing) {
	        return number(thing) && thing > 0;
	    }

	    /**
	     * Public function `negativeNumber`.
	     *
	     * Returns `true` if something is a positive number,
	     * `false` otherwise.
	     *
	     * @param thing          The thing to test.
	     */
	    function negativeNumber (thing) {
	        return number(thing) && thing < 0;
	    }

	    /**
	     * Public function `number`.
	     *
	     * Returns `true` if something is a real number,
	     * `false` otherwise.
	     *
	     * @param thing The thing to test.
	     */
	    function number (thing) {
	        return typeof thing === 'number' &&
	               isNaN(thing) === false &&
	               thing !== Number.POSITIVE_INFINITY &&
	               thing !== Number.NEGATIVE_INFINITY;
	    }

	    /**
	     * Public function `bool`.
	     *
	     * Returns `true` if something is a bool,
	     * `false` otherwise.
	     *
	     * @param thing The thing to test.
	     */
	    function bool (thing) {
	        return thing === false || thing === true;
	    }

	    /**
	     * Public function `map`.
	     *
	     * Returns the results hash of mapping each predicate to the
	     * corresponding thing's property. Similar to `like` but
	     * with functions instead of values.
	     *
	     * @param things {object}     The things to test.
	     * @param predicates {object} The map of functions to call against
	     *                            the corresponding properties from `things`.
	     */
	    function map (things, predicates) {
	        var property, result = {}, predicate;

	        verify.object(things);
	        verify.object(predicates);

	        for (property in predicates) {
	            if (predicates.hasOwnProperty(property)) {
	                predicate = predicates[property];

	                if (fn(predicate)) {
	                    result[property] = predicate(things[property]);
	                } else if (object(predicate)) {
	                    result[property] = map(things[property], predicate);
	                }
	            }
	        }

	        return result;
	    }

	    /**
	     * Public function `every`
	     *
	     * Returns the conjunction of all booleans in a hash.
	     *
	     * @param predicateResults {object} The hash of evaluated predicates.
	     */
	    function every (predicateResults) {
	        var property, value;

	        verify.object(predicateResults);

	        for (property in predicateResults) {
	            if (predicateResults.hasOwnProperty(property)) {
	                value = predicateResults[property];

	                if (object(value) && every(value) === false) {
	                    return false;
	                }

	                if (value === false) {
	                    return false;
	                }
	            }
	        }
	        return true;
	    }

	    /**
	     * Public function `any`
	     *
	     * Returns the disjunction of all booleans in a hash.
	     *
	     * @param predicateResults {object} The hash of evaluated predicates.
	     */
	    function any (predicateResults) {
	        var property, value;

	        verify.object(predicateResults);

	        for (property in predicateResults) {
	            if (predicateResults.hasOwnProperty(property)) {
	                value = predicateResults[property];

	                if (object(value) && any(value)) {
	                    return true;
	                }

	                if (value === true) {
	                    return true;
	                }
	            }
	        }

	        return false;
	    }

	    function mixin (target, source) {
	        var property;

	        for (property in source) {
	            if (source.hasOwnProperty(property)) {
	                target[property] = source[property];
	            }
	        }

	        return target;
	    }

	    /**
	     * Public modifier `verify`.
	     *
	     * Throws if `predicate` returns `false`.
	     */
	    function verifyModifier (predicate, defaultMessage) {
	        return function () {
	            var message;

	            if (predicate.apply(null, arguments) === false) {
	                message = arguments[arguments.length - 1];
	                throw new Error(unemptyString(message) ? message : defaultMessage);
	            }
	        };
	    }

	    /**
	     * Public modifier `maybe`.
	     *
	     * Returns `true` if `predicate` is  `null` or `undefined`,
	     * otherwise propagates the return value from `predicate`.
	     */
	    function maybeModifier (predicate) {
	        return function () {
	            if (!defined(arguments[0]) || nulled(arguments[0])) {
	                return true;
	            }

	            return predicate.apply(null, arguments);
	        };
	    }

	    /**
	     * Public modifier `not`.
	     *
	     * Negates `predicate`.
	     */
	    function notModifier (predicate) {
	        return function () {
	            return !predicate.apply(null, arguments);
	        };
	    }

	    function createModifiedPredicates (modifier) {
	        return createModifiedFunctions(modifier, predicates);
	    }

	    function createModifiedFunctions (modifier, functions) {
	        var name, result = {};

	        for (name in functions) {
	            if (functions.hasOwnProperty(name)) {
	                result[name] = modifier(functions[name], messages[name]);
	            }
	        }

	        return result;
	    }

	    function exportFunctions (functions) {
	        if (true) {
	            !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	                return functions;
	            }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	        } else if (typeof module !== 'undefined' && module !== null && module.exports) {
	            module.exports = functions;
	        } else {
	            globals.check = functions;
	        }
	    }
	}(this));


/***/ }
/******/ ])
});
;
/**
 * k2 - Functional javascript utils
 * @version v0.2.1
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("la"), require("check"), require("_"));
	else if(typeof define === 'function' && define.amd)
		define(["la", "check", "_"], factory);
	else if(typeof exports === 'object')
		exports["k2"] = factory(require("la"), require("check"), require("_"));
	else
		root["k2"] = factory(root["la"], root["check"], root["_"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_5__) {
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

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var findPartialMatches = _interopRequire(__webpack_require__(1));

	var rankPartialMatches = _interopRequire(__webpack_require__(2));

	module.exports = {
	  findPartialMatches: findPartialMatches,
	  rankPartialMatches: rankPartialMatches
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	__webpack_require__(3);
	var check = __webpack_require__(4);
	var _ = __webpack_require__(5);

	function findPartialMatchesSingleProperty(property, items, queryText) {
	  la(check.unemptyString(property), "need property name", property);
	  la(check.array(items), "expected list of items", items);
	  la(check.string(queryText), "expected query string", queryText);
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
	  la(check.arrayOfStrings(properties), "need properties", properties);
	  la(check.array(items), "expected list of items", items);
	  la(check.string(queryText), "expected query string", queryText);
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

	module.exports = findPartialMatchesMultipleProperties;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	__webpack_require__(3);
	var check = __webpack_require__(4);
	var _ = __webpack_require__(5);

	// given objects that match query text, rank them, with better matches first
	function rankPartialMatchesSingleProperty(property, matches, queryText) {
	  la(check.unemptyString(property), "need property name", property);
	  la(check.array(matches), "expected list of matches", matches);
	  la(check.string(queryText), "expected query string", queryText);
	  if (!matches.length || !queryText) {
	    return [];
	  }
	  var text = queryText.toLowerCase();

	  // ranks items, whereby a lower number is a better rank, assumes item
	  // matches the query string.
	  function rankMatch(item) {
	    var NOT_FOUND_RANK = 1000000;
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
	  la(check.arrayOfStrings(properties), "need properties", properties);
	  la(check.array(matches), "expected list of matches", matches);
	  la(check.string(queryText), "expected query string", queryText);
	  if (!matches.length || !queryText) {
	    return [];
	  }
	  var text = queryText.toLowerCase();

	  // ranks items, whereby a lower number is a better rank, assumes item
	  // matches the query string.
	  function rankMatch(property, item) {
	    var NOT_FOUND_RANK = 1000000;
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

	module.exports = rankPartialMatchesMultipleProperties;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ }
/******/ ])
});
;
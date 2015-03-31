/**
 * k2 - Functional functional javascript.
 * @version v0.0.0
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["k2"] = factory();
	else
		root["k2"] = factory();
})(this, function() {
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

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/*
	import findPartialMatches from './find-partial-matches.es6'
	*/

	var rankPartialMatches = _interopRequire(__webpack_require__(1));

	var k2 = {
	  // findPartialMatches: findPartialMatches,
	  rankPartialMatches: rankPartialMatches
	};
	exports.k2 = k2;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/*
	require('lazy-ass');
	var check = require('check-more-types');
	var _ = require('lodash');
	*/

	// given objects that match query text, rank them, with better matches first
	"use strict";

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

/***/ }
/******/ ])
});
;
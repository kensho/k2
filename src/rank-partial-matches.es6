/*
require('lazy-ass');
var check = require('check-more-types');
var _ = require('lodash');
*/

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

export default rankPartialMatchesMultipleProperties;

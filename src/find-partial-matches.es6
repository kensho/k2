require('lazy-ass');
var check = require('check-more-types');

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

export default findPartialMatchesMultipleProperties;

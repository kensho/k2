require('lazy-ass');
var check = require('check-more-types');
var _ = require('lodash');
la(check.fn(_.has), 'missing lodash.has method, version upgrade?', _.VERSION);

function presentProperties(testProperties, list) {
  la(check.arrayOf(check.unemptyString, testProperties),
    'missing test properties', testProperties);
  la(check.array(list), 'missing list of objects', list);

  return testProperties.filter(function (key) {
    return list.every(function (object) {
      return _.has(object, key);
    });
  });
}

export default _.curry(presentProperties);

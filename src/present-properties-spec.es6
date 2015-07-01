/* global describe, it */
require('lazy-ass');
var check = require('check-more-types');
var _ = require('lodash');

import presentProperties from './present-properties.es6';

describe.only('presentProperties', () => {
  it('is a function', () => {
    la(check.fn(presentProperties));
  });

  var good = [{
    name: 'foo',
    age: 1
  }, {
    name: 'bar',
    age: 20
  }, {
    name: 'baz',
    age: 21
  }];

  var empty = [{
    name: 'foo',
    age: 0
  }, {
    name: 'bar',
    age: 20
  }, {
    name: '',
    age: 21
  }];

  var bad = [{
    name: 'foo',
    age: 1
  }, {
    name: 'bar'
  }, {
    name: 'baz'
  }];

  var nested = [{
    person: {
      name: 'foo',
      age: 1
    }
  }, {
    person: {
      name: 'bar'
    }
  }, {
    person: {
      name: 'baz'
    }
  }];

  it('finds properties common to every item in the list', () => {
    const props = ['name', 'age'];
    const present = presentProperties(props)(good);
    la(check.array(present), 'returns an array');
    la(_.isEqual(present, props), 'all properties are present', present);
  });

  it('detects age property missing in some objects', () => {
    const props = ['name', 'age'];
    const present = presentProperties(props)(bad);
    la(check.array(present), 'returns an array');
    la(_.isEqual(['name'], present), 'only name is common property', present);
  });

  it('returns has for nested paths', () => {
    const obj = {
      person: {
        name: 'foo'
      }
    };
    la(_.has(obj, 'person'), 'has person');
    la(_.has(obj, ['person', 'name']), 'has person.name');
    la(!_.has(obj, ['person', 'age']), 'does not have person.age');
  });

  it('returns has for nested paths using .', () => {
    const obj = {
      person: {
        name: 'foo'
      }
    };
    la(_.has(obj, 'person'), 'has person');
    la(_.has(obj, 'person.name'), 'has person.name');
    la(!_.has(obj, 'person.age'), 'does not have person.age');
  });

  it('works with deep paths', () => {
    const props = ['person.name', 'person.age', 'last name'];
    const present = presentProperties(props)(nested);
    la(check.array(present), 'returns an array');
    la(_.isEqual(['person.name'], present),
      'only person.name is common property', present);
  });

  it('works with zero/empty values', () => {
    const props = ['name', 'age'];
    const present = presentProperties(props)(empty);
    la(check.array(present), 'returns an array');
    la(_.isEqual(present, props), 'all properties are present', present);
  });

  it('works without currying', () => {
    const props = ['name', 'age'];
    const present = presentProperties(props, empty);
    la(check.array(present), 'returns an array');
    la(_.isEqual(present, props), 'all properties are present', present);
  });
});

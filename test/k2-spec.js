if (typeof k2 === 'undefined') {
  var k2 = require('../k2');
}

describe('k2', function () {
  it('exists', function () {
    expect(k2).toBeDefined('k2 is defined');
    expect(typeof k2).toEqual('object', 'it is an object');
  });
});

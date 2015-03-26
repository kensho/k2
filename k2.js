(function () {
var k2 = {};

if (typeof exports === 'object') {
    module.exports = k2;
  } else if (typeof define === 'function' && define.amd) {
    define(function() { return k2; });
  } else {
    this.k2 = k2;
  }
}.call(this));

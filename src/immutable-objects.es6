var R = require('ramda');

/**
Makes a lens for immutable object updates on the given key.
@method objectLens */
function objectLens(key) {
  return R.lens(R.prop(key), function (val, obj) {
    var child = Object.create(obj);
    child.toJSON = function () {
      var base = {};
      if (obj.toJSON) {
        var base = obj.toJSON();
      }
      base[key] = val;
      return base;
    };
    child[key] = val;
    return child;
  });
}

export default objectLens;


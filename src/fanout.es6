export default function fanout(...fns) {
  return function (x) {
    return fns.map(function (fn) {
      return fn(x);
    });
  };
}


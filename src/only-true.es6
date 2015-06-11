/*
  Returns true only if for the given list of predicates,
  only single one is true, and the rest are false.

  onlyTrue(true, false, false); // true
  onlyTrue(false, false, false); // false
  onlyTrue(false, true, true); // false
  onlyTrue(false, false, true); // true
*/
function onlyTrue() {
  var predicates = Array.prototype.slice.call(arguments, 0);
  if (!predicates.length) {
    return false;
  }
  var count = 0, k;
  for (k = 0; k < predicates.length; k += 1) {
    if (predicates[k]) {
      count += 1;
      if (count > 1) {
        return false;
      }
    }
  }

  return count === 1;
}

export default onlyTrue;

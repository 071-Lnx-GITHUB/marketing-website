/**
 * Alternative to for-in loop
 *
 * @param {Object} `target` object to mutate/add keys/values
 * @param {Object} `src` source object to add keys/values from to `target`
 * @return {Object} the mutated `target` object
 *
 */
module.exports = function(target, src) {
  var keys = Object.keys(src);
  var len = keys.length;
  var i = 0;

  while (len--) {
    var key = keys[i++];
    var val = src[key];
    target[key] = val;
  }

  return target;
};

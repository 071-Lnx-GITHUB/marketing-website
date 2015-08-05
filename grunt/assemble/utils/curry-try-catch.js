/**
 * Wraps functions in a try/catch block and throws an error with their function name
 *
 * @param {Function} `fn` function to be wrapped in try/catch
 * @return {Function} "curried" function to be called with the original functions arugments
 *
 */
module.exports = function curryTryCatch(fn) {
  var name = fn.name;

  return function() {
    try {
      return fn.apply(fn, arguments);
    } catch(error) {
      throw new Error('Function Name: ' + name +  error);
    }
  };
};

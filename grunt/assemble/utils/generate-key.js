var path = require('path');

/**
 *
 * @param {String} `fp` file path string
 * @return {String} `key` file path string with extension removed
 *
 */
module.exports = function(fp) {
  var key = path.join(path.dirname(fp), path.basename(fp, path.extname(fp))).replace(process.cwd(), '');
  if (key[0] !== '/') {
    key = '/' + key;
  }
  return key;
};

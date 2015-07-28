var path = require('path');

/**
 * @param {String} `filepath` file path string
 * @return {String} `key` file path string with extension removed
 */
module.exports = function(filepath) {
  var key = path.join(path.dirname(filepath), path.basename(filepath, path.extname(filepath)))
                .replace(process.cwd(), '');

  if(key[0] !== '/') {
    key = '/' + key;
  }

  return key;
};

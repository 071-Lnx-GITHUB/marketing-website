var path = require('path');

/**
 * @param {String} `filepath` file path string
 * @return {String} `key` used to store and look up data for a file
 */
module.exports = function(filepath) {
  var key = path.join(path.dirname(filepath), path.basename(filepath, path.extname(filepath)))
                .replace(process.cwd(), '');

  if (key[0] === '/') {
    key = key.substring(1);
  }

  return key;
};

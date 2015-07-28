var _ = require('lodash');
var generateKey = require('./generate-key');
var path = require('path');

module.exports = function(assemble) {
  /**
   * Utility function for adding Global Data to the `assemble` instance
   * 1. external YML data with `global_` prefix will be added with a filepath key
   * 2. all other data will be added default key name
   *
   * @param {Object} `options` from the _assemble config file
   * @return {undefined} adds `data` to the `assemble` instance
   */
  var globalKeyCache = [];

  return function(options) {
    assemble.data(options.data, {
      namespace: function(filepath) {
        var filenameKey = path.basename(filepath, path.extname(filepath));

        if (/global\_/.test(filepath)) {
          if (globalKeyCache.indexOf(filenameKey) === -1) {
            globalKeyCache.push(filenameKey);
          }
          return generateKey(filepath);
        }
        return filenameKey;
      }
    });

    var data = assemble.get('data');
    for (var key in data) {
      if (globalKeyCache.indexOf(key) !== -1) {
        //remove mutations to global data
        delete data[key];
      }
    }

    //add the additonal data options with the standard key
    var addOptions = _.omit(options, 'data');
    assemble.data(addOptions);
  };
};

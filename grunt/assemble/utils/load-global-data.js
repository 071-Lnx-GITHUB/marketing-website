var path = require('path');
var _ = require('lodash');
var generateKey = require('./generate-key');

module.exports = function(assemble) {
  /**
   * Utility function for adding Global Data to the `assemble` instance
   * 1. external YML data with `global_` prefix will be added with a fp key
   * 2. all other data will be added default key name
   *
   * @param {Object} `options` from the _assemble config file
   * @return {undefined} adds `data` to the `assemble` instance
   */
  var globalKeyCache = [];
  return function loadGlobalData(options) {
    assemble.data(options.data, {
      namespace: function(fp) {
        var filenameKey = path.basename(fp, path.extname(fp));

        if(/global\_/.test(fp)) {
          if(globalKeyCache.indexOf(filenameKey) === -1) {
            globalKeyCache.push(filenameKey);
          }
          return generateKey(fp);
        }
        return filenameKey;
      }
    });
    var data = assemble.get('data');

    for(var key in data) {
      if(globalKeyCache.indexOf(key) !== -1) {
        //remove mutations to global data
        delete data[key];
      }
    }
    //add the additonal data options with the standard key
    var addOptions = _.omit(options, 'data');
    assemble.data(addOptions);
  };

};

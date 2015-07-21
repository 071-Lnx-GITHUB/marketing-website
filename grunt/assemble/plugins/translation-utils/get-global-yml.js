var path = require('path');
var _ = require('lodash');

/**
 *
 * Create an object of global yaml data and delete keys from globalData
 * that reference file paths rather than file names
 * this inentionally mutates the assemble.cache.data object as it is not immutable
 *
 * globalYml = {
 *   fpBasenameNoExt: ymlDataObj
 * }
 *
 */
module.exports = function getGlobalYml(globalData) {
  var globalYml =  Object.keys(globalData).reduce(function(o, key) {
    if(/global\_/.test(key)) {
      var basenameKey = path.basename(key, path.extname(key));
      o[basenameKey] = _.cloneDeep(globalData[key]);

      //intentionally mutate the assemble.cached.data object
      globalData[basenameKey] = globalData[key];
      delete globalData[key];
    }
    return o;
  }, {});

  return globalYml;
};

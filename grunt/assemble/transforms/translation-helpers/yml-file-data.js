var path = require('path');
var _ = require('lodash');
var Plasma = require('plasma');

module.exports = function(assemble) {
  var pagesNamespace = assemble.get('data.pageContentNamespace');
  var testPath = assemble.get('data.testPath');

  /**
   * Reads external yml data per directory and namespaces it under the `pagesNamespace`
   *
   * @param {String} `patterns` globbing patterns for data files
   * @param {String} `cwd` current working directory for plasma to source files
   * @return {Object} `data` data object of parsed yml under the `pagesNamespace` key
   *
   */
  return function(patterns, cwd) {
    var plasma = new Plasma();
    var iterator = 0;
    var keysCache = [];
    var lastKey, data;
    patterns = Array.isArray(patterns) ? patterns : [patterns];
    patterns.push('!**/global_*.{yml,yaml,json}');
    plasma.option('cwd', cwd);
    plasma.option('namespace', function(fp) {
      var replace = testPath || process.cwd();
      var key = path.join(path.dirname(fp), 'index').replace(replace, '');
      if (key[0] !== '/') {
        key = '/' + key;
      }

      if (keysCache.length && keysCache.indexOf(key) !== -1) {
        //intentionally use an obscure separator because the dash was clobbering file paths
        //with dashes in them
        key = key + '~' + iterator;
        iterator += 1;
      } else {
        keysCache.push(key);
      }
      //namespace to the file name
      return key;
    });

    data = plasma.load(patterns);
    /**
     * If the directory is empty plasma will return the patterns array
     */
    if (data !== patterns && !Array.isArray(data)) {
      if (iterator > 0) {
        data = Object.keys(data).reduce(function(o, key) {
          var matched;
          if (lastKey && key.indexOf('~') !== -1) {
            matched = key.split('~')[0];
            if (matched === lastKey.split('~')[0]) {
              _.extend(o[matched], data[key]);
              delete data[key];
            }
          } else {
            o[key] = data[key];
          }
          lastKey = matched ? matched : key;
          return o;
        }, {});
      }
      //create the namespace for page data
      data = Object.keys(data).reduce(function(o, key) {
        o[key] = {};
        o[key][pagesNamespace] = data[key];
        return o;
      }, {});
    } else {
      data = {};
    }
    return data;
  };
};

var _ = require('lodash');
var path = require('path');
var Plasma = require('plasma');

/**
 * Load page data from external YAML (exclude Global YAML).
 *
 * All arguments from assemble.transform() are passed here:
 *  - transformName
 *  - transformFn
 *  - patterns
 *  - cwd
 *  - locale
 *  - namespace
 */
module.exports = function(assemble, args) {
  var patterns = args[2],
      cwd = args[3],
      locale = args[4],
      namespace = args[5];

  patterns = Array.isArray(patterns) ? patterns : [patterns];
  patterns.push('!**/global_*.yml'); // exclude global YAML files

  var delimiter = '~'; // obscure character to avoid collisions with filenames
  var keysCache = {};

  var plasma = new Plasma();
  plasma.option('cwd', cwd);
  plasma.option('namespace', function(filepath) {
    var key = path.join(path.dirname(filepath), '')
                  .replace(process.cwd(), '');

    if (key[0] !== '/') {
      key = '/' + key;
    }

    if (key in keysCache) {
      key += delimiter + keysCache[key]++;
    }
    else {
      keysCache[key] = 0;
    }

    return key;
  });

  var data = plasma.load(patterns);

  // Plasma returns patterns when the directory is empty
  if (data !== patterns) {
    // merge files from the same folder
    for (var key in data) {
      var index = key.indexOf(delimiter);
      if (index !== -1) {
        var baseKey = key.substring(0, index);
        _.merge(data[baseKey], data[key]);
        delete data[key];
      }
    }

    // move data to namespace
    data = Object.keys(data).reduce(function(output, key) {
      output[key] = {};
      output[key][namespace] = data[key];
      return output;
    }, {});

    // update assemble cache
    var pageData = assemble.get('pageData') || {};
    _.merge(pageData[locale], data);
    assemble.set('pageData', pageData);
  }
};

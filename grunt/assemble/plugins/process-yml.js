var _ = require('lodash');
var path = require('path');
var through = require('through2');

var generateKey = require('../utils/generate-key')

// load data from external YML files and store in 'assemble.cache'
module.exports = function(assemble) {
  var options = assemble.get('config.options');
  var globalYmlFilenamePrefix = options.globalYmlFilenamePrefix;
  var localesRoot = options.localesRoot;
  var websiteRoot = options.websiteRoot;

  return through.obj(function(file, enc, callback) {
    var key = generateKey(file.path);
    var dirname = path.dirname(key);
    var filename = path.basename(file.path);

    if (dirname === localesRootDir && _.startsWith(filename, globalYmlFilenamePrefix)) {
      // global
    }
    // else if (dirname in ymlData) {
    // }



    // var data = assemble.cache.data[key];
    // var filename = path.basename(key);

    // if (dirname === localesRootDir && prefix === options.globalYmlFilenamePrefix) {
    //   // global YML file
    //   globalYmlData[filename] = data;
    // }
    // else if (dirname in ymlData) {
    //   // merge multiple files from the same directory
    //   _.assign(ymlData[dirname][options.pageDataNamespace], data);
    // }
    // else {
    //   ymlData[dirname] = {};
    //   ymlData[dirname][options.pageDataNamespace] = data;
    // }


    this.push(file);
    callback();
  });
};

var through = require('through2');
var generateKey = require('../utils/generate-key');

module.exports = function(assemble) {
  var types = {};

  return through.obj(function (file, enc, cb) {
    if (/\/resources\-list\//.test(file.path)) {
      var type = file.data.TR_type;
      var key = generateKey(file.path);
      types[key] = type;
    }
    this.push(file);
    cb();
  }, function(cb) {
    assemble.set('resourceTypes', types);
    cb();
  });
};


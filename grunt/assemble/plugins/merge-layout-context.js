var through = require('through2');
var _ = require('lodash');

module.exports = function() {
  // middleware to merge the layout context into the current page context
  return through.obj(function (file, enc, cb) {
    _.forEach(file.data.layouts, function(val, key) {
      _.merge(file.data, val);
      delete file.data.layouts;
    });
    this.push(file);
    cb();
  });
};


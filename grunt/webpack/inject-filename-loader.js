var loaderUtils = require('loader-utils');

module.exports = function(source, map) {
  var options = loaderUtils.parseQuery(this.query);
  if (this.cacheable) {
    this.cacheable();
  }
  var wrapper = options.banner + options.inject + source + '\n\n' + options.footer;
  this.callback(null, wrapper, map);
};

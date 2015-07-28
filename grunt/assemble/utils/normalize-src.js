var path = require('path');

module.exports = function(cwd, sources) {
  sources = Array.isArray(sources) ? sources : [sources];

  return sources.map(function(src) {
    return (src[0] === '!') ?
      path.join('!' + cwd, src.substring(1)) :
      path.join(cwd, src);
  });
};

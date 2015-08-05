var path = require('path');

module.exports = function(dest, compare, insertTrue, insertFalse, linkPath) {
    var base = path.dirname(dest);
    base = base.substr(base.lastIndexOf('/') + 1);

    if (base === compare) {
       return insertTrue;
    } else if (insertFalse && typeof linkPath === 'string') {
       return path.join(linkPath, insertFalse);
    } else {
      return '';
    }
};

var path = require('path');

module.exports = function isCurrentDest (thisDest, compareDest, bool, options) {
  var reURL = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
  var destName = path.basename(thisDest.dirname);

  try{
    if (compareDest[0] === '/') {
      compareDest = compareDest.substr(1);
    } else if (reURL.test(compareDest)) {
      compareDest = compareDest.split('//')[1];
      compareDest = compareDest.substring(0, compareDest.indexOf('.'));
    }
  } catch(e) {
    console.log(thisDest, compareDest);
  }

  if (destName === compareDest) {
    if (bool) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  } else {
    if (bool) {
      return options.inverse(this);
    } else {
      return options.fn(this);
    }
  }
};

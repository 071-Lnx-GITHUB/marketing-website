var path = require('path');

/**
 * Combine and 'normalize' src paths to cwd from a dynamic file mapping:
 * http://gruntjs.com/configuring-tasks#building-the-files-object-dynamically
 *
 * e.g.
 * 
 * target: {
 *   files: [
 *     { cwd: 'src/a', src: ['a*.*', '!a1.*'] },
 *     { cwd: 'src/b', src: ['b*.*', '!bb.*'] },
 *     { src: ['src/c/c*.*'] }
 *   ]
 * }
 * 
 * returns:
 * ['src/a/a*.*', '!src/a/a1.*', 'src/b/b*.*', '!src/b/bb.*', 'src/c/c*.*']
 */
module.exports = function(files) {
  var normalizedSrc = [];

  files = Array.isArray(files) ? files : [files];

  files.forEach(function(file) {
    var sources = Array.isArray(file.src) ? file.src : [file.src];

    sources.forEach(function(src) {
      if (file.cwd) {
        normalizedSrc.push(
          (src[0] === '!') ?
            path.join('!' + file.cwd, src.substring(1)) :
            path.join(file.cwd, src));
      }
      else {
        normalizedSrc.push(src);
      }
    });
  });

  return normalizedSrc;
};

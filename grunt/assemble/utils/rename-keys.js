var path = require('path');

/**
 * Different rename keys for Assemble loaders
 *
 * @param {Function} `defaultKey` defualt Assemble rename key
 * @return {Type} Description
 *
 */
module.exports = function(defaultKey) {
  return {
    dirnameKey: function (search) {
      return function (fp) {
        if (fp.indexOf(search) > -1) {
          var segments = path.dirname(fp).split('/');
          return segments[segments.length - 1];
        }
        return defaultKey(fp);
      };
    },
    noExtPath: function (fp) {
      var ext;
      var noExtPath;
      if (/\.hbs/.test(fp)) {
        ext = '.hbs';
      } else if (/.\html/.test(fp)) {
        ext = '.html';
      }
      if (ext) {
        noExtPath = path.join(path.dirname(fp), path.basename(fp, ext));
      } else {
        noExtPath = fp;
      }

      return noExtPath;
    },
    dirnamePageKey: function (search) {
      return function (fp) {
        // fp => website/about/index.hbs
        if (fp.indexOf(search + '/') > -1 && fp.indexOf(search + '/index') === -1) {
            var segments = path.dirname(fp).split('/');
            return segments[segments.length - 1];
          }
          return defaultKey(fp);
        };
    },
    dirnameLangKey: function (locales) {
      return function (fp) {
        var key;
        var base = fp.substr(0, fp.indexOf('/'));
        if (fp.indexOf(base + '/') > -1 && fp.indexOf(base + '/index') === -1) {
          key = fp.substr(0, fp.lastIndexOf('/'));
        } else {
          key = path.join(base, path.basename(fp).replace(path.extname(fp), ''));
        }
        return key;
      };
    }
  };
};

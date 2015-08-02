var _ = require('lodash');
var globby = require('globby');
var path = require('path');

// TODO: optimize this
module.exports = function(assemble) {
  var cwdPath = '';
  var localesRoot = assemble.get('config.options.localesRoot');

  // array of matching filenames
  var localesFiles = globby.sync('**/*.{hbs,yml}', {
    cwd: path.join(process.cwd(), cwdPath, localesRoot)
  });

  var subfolderO = localesFiles.reduce(function(o, fp) {
    var key = '/' + path.join(localesRoot, path.dirname(fp), 'index');

    if (!o[key]) {
      o[key] = [];
    }

    o[key].push(path.extname(fp).replace('.', ''));

    return o;
  }, {});

  return Object.keys(subfolderO).reduce(function(memo, fp) {
      var data = _.uniq(subfolderO[fp]);
      var key;

      if (data.indexOf('hbs') !== -1) {
        key = 'hasOwnTemplate';
      }
      else if (data.length === 1 && data.indexOf('yml') !== -1) {
        // TODO: why just data.length of 1?
        key = 'hasNoTemplate';
      }
      // TODO: what about else?

      memo[key].push(fp);

      return memo;
    }, {
      hasOwnTemplate: [],
      hasNoTemplate: []
    });
};

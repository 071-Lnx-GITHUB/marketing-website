var path = require('path');
var globby = require('globby');
var _ = require('lodash');

module.exports = function hasOwnTemplate(assemble) {
  var subfoldersRoot = assemble.get('data.subfoldersRoot');
  var cwdPath = assemble.get('data.testPath') || '';
  var subfolderFiles = globby.sync('**/*.{hbs,yml}', {cwd: path.join(process.cwd(), cwdPath, subfoldersRoot)});

  var subfolderO = subfolderFiles.reduce(function(o, fp) {
    var key = '/' + path.join(subfoldersRoot, path.dirname(fp), 'index');
    if(!o[key]) {
      o[key] = [];
    }
    o[key].push(path.extname(fp).replace('.', ''));

    return o;
  }, {});

  return Object.keys(subfolderO).reduce(function(memo, fp) {
    var data = _.uniq(subfolderO[fp]);
    var key;
    if(data.indexOf('hbs') !== -1) {
      key = 'hasOwnTemplate';
    } else if(data.length === 1 && data.indexOf('yml') !== -1) {
      key = 'hasNoTemplate';
    }

    memo[key].push(fp);

    return memo;
  }, {
    hasOwnTemplate: [],
    hasNoTemplate: []
  });
};

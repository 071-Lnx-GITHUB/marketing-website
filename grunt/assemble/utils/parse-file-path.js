var _ = require('lodash');
var path = require('path');

var generateKey = require('./generate-key');

// TODO: optimize
module.exports = function(assemble) {
  var config = assemble.get('config');
  var locales = config.options.locales;
  var localesRoot = config.options.localesRoot;
  var websiteRoot = config.options.websiteRoot;

  /**
   * Utility function to check if a filepath represents a websiteRoot or subfolder path
   *
   * @param {String} `filepath` filepath to test
   * @param {String} `testString` root name for `website` or `subfolders`
   * @return {Boolean}
   *
   */
  function isIndex(filepath, testStr) {
    if (filepath[0] !== '/') {
      filepath = '/' + filepath;
    }
    return filepath.indexOf('/' + testStr + '/') !== -1;
  }

  /**
   * Use to parse info from filepath such as what type of file object it is
   * local (website|de|jp)
   * @param {String} `filepath` filepath from file data object
   * @return {Object} Utility object with keys isRoot, isSubfolder, isModal, isLayout, dataKey, and locale
   *
   */
  return function(filepath) {
    var data = {
      dataKey: generateKey(filepath)
    };

    if (isIndex(filepath, websiteRoot)) {
      data.locale = websiteRoot;
      data.isRoot = true;
    }
    else if (isIndex(filepath, localesRoot)) {
      var localeIndex, localePath;
      localeIndex = _.findIndex(locales, function(locale) {
        var split = filepath.replace(process.cwd(), '').replace(localesRoot, '').split('/');
        return split.indexOf(locale) !== -1;
      });
      data.locale = locales[localeIndex];
      localePath = '/' + localesRoot + '/' + data.locale + '/';
      data.parentKey = data.dataKey.replace(localePath, '/' + websiteRoot + '/');
      data.isSubfolder = true;
    }
    else {
      data.locale = path.dirname(filepath).split('/').slice(-1)[0];

      switch (data.locale) {
        case 'modals':
          data.isModal = true;
          break;
        case 'partials':
          data.isPartial = true;
          break;
        case 'layouts':
          data.isLayout = true;
      }
    }

    return data;
  };
};

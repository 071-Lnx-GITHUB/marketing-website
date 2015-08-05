'use strict';

var path = require('path');
var _ = require('lodash');

module.exports = function (assemble) {
  var websiteRoot = assemble.get('data.websiteRoot');
  var locales = assemble.get('data.locales');
  var generateKey = require('./generate-key');

  /**
   * Utility function to check if a filepath represents a websiteRoot or subfolder path
   *
   * @param {String} `fp` filepath to test
   * @param {String} `testString` root name for `website` or `subfolders`
   * @return {Boolean}
   *
   */
  function isIndex(fp, testStr) {
    if (fp[0] !== '/') {
      fp = '/' + fp;
    }
    return fp.indexOf('/' + testStr + '/') !== -1;
  }

  /**
   * Use to parse info from filepath such as what type of file object it is
   * local (website|de|jp)
   * @param {String} `fp` filepath from file data object
   * @return {Object} Utility object with keys isRoot, isSubfolder, isModal, isLayout, dataKey, and locale
   *
   */
  return function (fp) {
    var subfoldersRoot = assemble.get('data.subfoldersRoot');
    var data = {
      dataKey: generateKey(fp)
    };
    var localeIndex, parentKey, localePath;

    if (isIndex(fp, websiteRoot)) {
      data.locale = websiteRoot;
      data.isRoot = true;
    } else if (isIndex(fp, subfoldersRoot)) {
      localeIndex = _.findIndex(Object.keys(locales), function(locale) {
        var split = fp.replace(process.cwd(), '').replace(subfoldersRoot, '').split('/');
        return split.indexOf(locale) !== -1;
      });
      data.locale = Object.keys(locales)[localeIndex];
      localePath = '/' + subfoldersRoot + '/' + data.locale + '/';
      parentKey = data.dataKey.replace(localePath, '/' + websiteRoot + '/');
      data.parentKey = parentKey;
      data.isSubfolder = true;
    } else {
      data.locale = path.dirname(fp).split('/').slice(-1)[0];
      switch (data.locale) {
        case 'modals':
          data.isModal = true;
          break;
        case 'partials':
          data.isPartial = true;
          break;
        case 'layouts':
          data.isLayout = true;
          break;
      }
    }
    return data;
  };
};


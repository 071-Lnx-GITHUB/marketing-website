var _ = require('lodash');
var path = require('path');

module.exports = function(assemble){
  var subfoldersRoot = assemble.get('data.subfoldersRoot');
  var websiteRoot = assemble.get('data.websiteRoot');

/**
 * Function for populating the page data object with filepath related objects inherited from the parent website
 * if they do not have their own templates or yml files in subfolders.
 *
 * @param {String} `locale` function to be wrapped in try/catch
 * @param {Object} `pageDataClone` function to be wrapped in try/catch
 * @return {Object} Mutatest the `pageDataClone` object
 *
 */
  return function populateSubfolderData(locale, pageDataClone) {

    _.forEach(pageDataClone[websiteRoot], function(val, fp) {
      var subfolderPath = fp.replace('/' + websiteRoot + '/', '/' + path.join(subfoldersRoot, locale) + '/');
      if(!pageDataClone[locale][subfolderPath]) {
        //have to merge here or lose values not flagged for translation
        pageDataClone[locale][subfolderPath] = _.merge({}, pageDataClone[websiteRoot][fp] || {}, val);
      }
    });

    return pageDataClone;
  };
};

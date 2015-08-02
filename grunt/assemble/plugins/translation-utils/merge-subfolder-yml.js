var _ = require('lodash');

module.exports = function(assemble) {
  var createDictionary = require('../../utils/create-dictionary')(assemble);
  var parseFilePath = require('../../utils/parse-file-path')(assemble);

  var subfolderTempData = require('./get-subfolder-template-data')(assemble);
  var websiteRoot = assemble.get('config.options.websiteRoot');

  return function(lang, pageDataClone) {
    var hasNoTemplate = subfolderTempData.hasNoTemplate;

    // just yml files that don't have a template in the same folder
    hasNoTemplate.forEach(function(fp) {
      var filePathData = parseFilePath(fp);
      var locale = filePathData.locale;
      var parentKey = filePathData.parentKey;

      if (pageDataClone[locale] && pageDataClone[locale][fp]) {
        lang[locale] = lang[locale] || {};
        lang[locale][fp] = lang[locale][fp] || {};
        lang[locale][fp] = createDictionary(pageDataClone[locale][fp], locale);
        pageDataClone[locale][fp] =
          _.merge({}, pageDataClone[websiteRoot][parentKey], pageDataClone[locale][fp]);
      }
    });

    return pageDataClone;
  };
};

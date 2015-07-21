var _ = require('lodash');
var curryTryCatch = require('../../utils/curry-try-catch');

module.exports = function(assemble) {
  var parseFilePath = require('../../utils/parse-file-path')(assemble);
  var createTranslationDict = require('../../utils/create-dictionary')(assemble);
  var websiteRoot = assemble.get('data.websiteRoot');
  var subfolderTempData = curryTryCatch(require('./get-subfolder-template-data'))(assemble);

  return function mergeSubfolderYml(lang, pageDataClone) {
    var hasNoTemplate = subfolderTempData.hasNoTemplate;
    hasNoTemplate.forEach(function(fp) {
      var filePathData = parseFilePath(fp);
      var locale = filePathData.locale;
      var parentKey = filePathData.parentKey;
      if(pageDataClone[locale] && pageDataClone[locale][fp]) {
        lang[locale] = lang[locale] || {};
        lang[locale][fp] = lang[locale][fp] || {};
        lang[locale][fp] = createTranslationDict(pageDataClone[locale][fp], locale);
        pageDataClone[locale][fp] = _.merge({}, pageDataClone[websiteRoot][parentKey], pageDataClone[locale][fp]);
      }
    });

    return pageDataClone;
  };
};

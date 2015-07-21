var _ = require('lodash');
var extendWhile = require('../utils/extend-while');

module.exports = function(assemble) {
  var websiteRoot = assemble.get('data.websiteRoot');
  var locales = assemble.get('data.locales');
  var parseFilePath = require('../utils/parse-file-path')(assemble);
  var removeTranslationKeys = require('../utils/remove-translation-keys')(assemble);
  var lastLocale;

  return function mergeTranslatedData (file, next) {
    var rootData = assemble.get('rootData');
    var translated = assemble.get('translated');
    var filePathData = parseFilePath(file.path);
    var locale = filePathData.locale;
    var dataKey = filePathData.dataKey;
    var dictKey = locales[locale];
    var data;

    removeTranslationKeys(file.data);

    if(!file.data.isPpc) {

      //extend the file with the external YML content
      if(filePathData.isRoot) {
        file.data.locale = websiteRoot;
        file.data.langKey = 'en_US';
        //extend the local yml data to the page
        data = rootData[dataKey];
      } else if(filePathData.isSubfolder) {
        //set the locale on the page context for modal|partial translation
        file.data.locale = locale;
        file.data.langKey = dictKey;
        file.data.dataKey = dataKey;
        data = translated[dictKey] && translated[dictKey][dataKey];

        //attach translated global data
        if(locales[locale] && locale !== lastLocale) {
          var globalData = assemble.get('data');
          var translatedGlobal = translated[dictKey].global[locale];

          extendWhile(globalData, translatedGlobal);
          lastLocale = locale;
        }
      }

      //extend the file data with layouts and translations
      if(data) {
        //TODO: figure out how to do this transform earlier
        if(data.page_content) {
          file.content = data.page_content;
        }
        _.merge(file.data, data);
      }

    }//end !ppc if
    next();
  };
};

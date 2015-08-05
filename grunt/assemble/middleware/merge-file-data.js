var _ = require('lodash');

module.exports = function(assemble) {
  var websiteRoot = assemble.get('data.websiteRoot');
  var parseFilePath = require('../utils/parse-file-path')(assemble);
  var removeTranslationKeys = require('../utils/remove-translation-keys')(assemble);

  return function mergeTranslatedData (file, next) {
    var rootData = assemble.get('rootData');
    var filePathData = parseFilePath(file.path);
    var dataKey = filePathData.dataKey;
    var data;
    removeTranslationKeys(file.data);

    if (!file.data.isPpc) {
      //extend the file with the external YML content
      if (filePathData.isRoot) {
        file.data.locale = websiteRoot;
        file.data.langKey = 'en_US';
        //extend the local yml data to the page
        data = rootData[dataKey];
      }

      //extend the file data with layouts and translations
      if (data) {
        //TODO: figure out how to do this transform earlier
        if (data.page_content) {
          file.content = data.page_content;
        }
        _.merge(file.data, data);
      }
    }//end !ppc if
    next();
  };
};
